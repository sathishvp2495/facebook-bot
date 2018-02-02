var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 1500, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
   appId: '',
   appPassword: ''
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

console.log("bot framework added");

// bot.dialog('/', function (session) {
   // session.send("Hello");
    //session.beginDialog('/createSubscription');
    bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
               
               bot.beginDialog(message.address, '/');
            }
        });
    }
});
// });


bot.dialog('/', [
    function (session) {
        session.beginDialog('/start', session.userData);
    }
]);

bot.dialog('/start',[
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many months have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        session.send("Got it... " + session.userData.name + 
                     " you've been programming for " + session.userData.coding+" months");
                     session.endDialog("will see later");
    }
    ]);
