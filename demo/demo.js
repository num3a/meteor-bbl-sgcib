Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {
  Meteor.subscribe('messages');

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.chat.helpers({
    messages:function(){
      return Messages.find({},{sort:{date: -1}});
    }
  });

  Template.chat.events({
    'submit form' : function(event, template){
      event.preventDefault();

      var messageToInsert = event.target.newMessage.value;

      Messages.insert({text: messageToInsert, date: new Date()});

      event.target.newMessage.value = "";
      console.log('Message:', messageToInsert);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('messages', function() {
    return Messages.find({},{sort:{date: -1}, limit: 10});
  });
}
