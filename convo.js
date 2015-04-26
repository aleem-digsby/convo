if (Meteor.isClient)
{
    Accounts.onLogin(function()
    {
        Meteor.call("setCurrentUser",Meteor.user().username);
    });
    Deps.autorun(function()
    {
         Meteor.subscribe("users");
         Meteor.subscribe("currentUsers");
         Meteor.subscribe("convo");
         var user = Meteor.user();
    });
   Template.lobby.helpers
   ({
            current:function()
            {
                return Meteor.currentUsers.find({});
                //console.log(b);
               // var t =b.fetch();
               // console.log(t);
               // console.log(t[0].username);
                //console.log( Meteor.currentUsers.find({}).fetch()[0].username);
            },
            messages:function()
            {
                return Meteor.convo.find({});
            },
            userName: function()
            {
                return Meteor.user().username;
            }
   });
   Template.lobby.events
   ({
        "submit #shareForm":function(event,template)
        {
            event.preventDefault();
            var message = (event.target.message.value).trim();
            event.target.message.value = "";
            if(message != "")
            {
                Meteor.call("addMessage",Meteor.user().username,message);
            }
        },
        "click #logout":function(event,template)
        {
            event.preventDefault();
            Meteor.call("remove",Meteor.user().username);
            Meteor.logout();
            Router.go("signup");
            console.log("Logging out");
        }
   });
   Template.header2.helpers
   ({
        firstName:function()
        {
            console.log(Meteor.user());
            return Meteor.user().profile[0].name[0].firsName;
        },
         lastName:function()
        {
            console.log(Meteor.user());
            return Meteor.user().profile[0].name[0].lastName;
        },

   });
   Template.header2.events
   ({
        "click #logout":function()
        {
            console.log("hey moto");
            console.log(Meteor.user());
            Meteor.call("remove",Meteor.user().username);
            Meteor.logout();
            console.log(Meteor.user());
        }
   });
    Template.header.helpers
    ({
        loginError:function()
        {
            return Session.get("errorLogin");
        }
    });

    Template.header.events
    ({
        "submit #signinForm":function(event,template)
        {
            event.preventDefault();
            console.log(event.target.loginUsername.value);
            username = (event.target.loginUsername.value).trim();
            password = (event.target.loginPassword.value).trim();
            console.log(username + " "+password);
            Meteor.loginWithPassword({username:username},password,function(e)
            {
                if(e)
                {
                    console.log(e);
                    Session.set("errorLogin",true);
                }
                else
                {
                     Session.set("errorLogin",false);
                    Router.go("lobby");
                }
            });
            var use = Meteor.user()._id;
            console.log(use);
            console.log(use._id);

         
            return false;
        }
    });
    Template.signup.helpers
    ({

    });
    Template.signup.events
    ({
        "submit #signupForm":function(event,template)
        {
            event.preventDefault();
            console.log(event.target.signupFirstName.value);
          var firstName = event.target.signupFirstName.value;
          event.target.signupFirstName.value = "";
          var lastName = event.target.signupLastName.value;
          event.target.signupLastName.value = "";
          var username = event.target.signupUsername.value;
          event.target.signupUsername.value = "";
          var password = event.target.signupPassword.value;
          event.target.signupPassword.value = "";
          Meteor.call("createNewUser",firstName,lastName,username,password);
        }
    });
    Accounts.onLoginFailure(function()
    {
            console.log("login failed");
    });
    Accounts.onLogin(function()
    {
            console.log("login successful");
            
    });
}
if(Meteor.isServer) 
{
    Meteor.publish("currentUsers",function()
    {
        return Meteor.currentUsers.find({});
    });
    Meteor.publish("users",function()
    {
        return Meteor.users.find({});
    });
    Meteor.publish("convo",function()
    {
        return Meteor.convo.find({});
    });
        Meteor.methods(
        {
            remove: function(user)
            {
                Meteor.currentUsers.remove({username:user});
            },
            addMessage:function(username,message)
            {
                Meteor.convo.insert({user:username,message:message});
            },
            setCurrentUser: function(username)
            {
                console.log("not here");
                

                var t = Meteor.currentUsers.find({username:username}).fetch();
                if(t == "")
                {
                    console.log(t);
                    console.log("t is here");
                    Meteor.currentUsers.insert({username:username});
                }
                else
                {
                    console.log("user already logged in");
                }
            },
            createNewUser: function(tfirstName,tlastName,tusername,tpassword)
            {
                console.log(tfirstName + " " + tlastName + " " + tusername + " " + tpassword);
                user = 
                {
                    username : tusername,
                    password:tpassword,
                    profile:
                    [{
                        name:
                        [{
                            firsName:tfirstName,
                            lastName:tlastName
                        }]
                    }]
                };
                Accounts.createUser(user);
            }
        });
}
Router.route("/",function()
{
    this.render("signup");
});
Router.route("/lobby",function()
{
    if(!Meteor.userId())
    {
        this.redirect("/");
    }
    else{
    this.render("lobby");
}
});
   


Meteor.currentUsers = new Meteor.Collection("currentUsers");
Meteor.convo = new Meteor.Collection("convo");