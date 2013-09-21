(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		template: $('#contact_template').html(),
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson'
		},
		initialize: function () {	
			this.collection.on('add', this.addOne, this);
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
			this.counter = 1;
			this.render();

		},
		addPerson: function (evt) {
			evt.preventDefault();

			this.collection.create({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			}, { wait: true });

			this.clearForm();
		},

		addOne: function(contact) {
			this.counter++;
			contact.set("position", this.counter);
			var contactView = new PersonView({ model: contact });
			this.contacts_list.append(contactView.render().el);
		},		

      	render: function () {
      		this.collection.each( this.addOne, this );
			return this;
     	},

		clearForm: function() {
			this.input_name.val('');
			this.input_number.val('');
			this.input_username.val('');
			
		}

	});

	var PersonModel = Backbone.Model.extend({
		validate: function(attrs) {

			if ( ! attrs.name || ! attrs.username ) {
				return 'Fullname and Username are required.';
			}

			if( isNaN(attrs.number) == true ){
				return 'Please enter a valid number';
			}
		},		

		idAttribute : '_id',
		urlRoot: 'http://localhost:9090/contacts',
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},

		initialize: function () {
			this.on("invalid",function(model,error){
            	alert(error);
        	});
		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http://localhost:9090/contacts',
		initialize: function () {

		}
	});
	
	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		templateEdit: $('#edit_mode_template').html(),
		events: {
			'click a.delete': 'delete',
			'click a.edit'  : 'edit',
			'click span.cancel' : 'cancel',
			'click span.done' : 'done'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
    		this.listenTo(this.model, 'destroy', this.remove);
			this.contacts_list = $('.table tbody');
		},

		edit: function() {	

			var compiledTemplateEdit = _.template(this.templateEdit);
			this.$el.html(compiledTemplateEdit(this.model.toJSON()));
			this.input_name = this.$('#edit-name');
			this.input_number = this.$('#edit-number');
			this.input_username = this.$('#edit-username');

			return this;
		},


		delete: function() {

			this.model.destroy({
	          success: function () {
	            console.log('destroyed');
	          }
	        })
		},

		render: function() {

			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			console.log(this.model);
			return this;
		},

		unrender: function() {
			this.remove();
		},

		cancel: function() {
			this.render();	
		},

		done: function(evt) {
			evt.preventDefault();

			this.model.save({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});
			this.render();
		}


	});
	



	people = new PersonCollection;
	people.fetch().then(function() {
		new App({ collection: people });
	});



})(jQuery, Backbone, _)
