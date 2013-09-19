(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson'
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
		},
		addPerson: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			this.collection.add(person);
			person.set("num", this.collection.length);

			var view = new PersonView({model: person});
			this.contacts_list.append(view.render().el);
		}
	});

	var PersonModel = Backbone.Model.extend({
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		initialize: function () {

		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: '/contacts',
		initialize: function () {
			
		}
	});

	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		initialize: function() {

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var contactApp = new App({collection: new PersonCollection()});



})(jQuery, Backbone, _)