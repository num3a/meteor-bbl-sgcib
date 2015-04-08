Messages = new Meteor.Collection('messages');
Messages.allow({
    insert:function(){
        return true;
    }
});

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
            var userName = event.target.userName.value;
            var messageToInsert = event.target.newMessage.value;

            if(userName == "")
            {
                Materialize.toast('Enter a user name.', 4000);
                return;
            }
            //Messages.insert({userName:userName,text: messageToInsert, date: new Date()});

            Meteor.call('postMessage', messageToInsert,userName);
            event.target.newMessage.value = "";
            console.log('Message:', messageToInsert);
        }
    });

    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('HH:MM:SS');
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({
        postMessage:
            function (message,username){
                Messages.insert({userName:username,text: message, date: new Date()});
            }
    });

    Meteor.publish('messages', function() {
        return Messages.find({},{sort:{date: -1}, limit: 10});
    });
}
