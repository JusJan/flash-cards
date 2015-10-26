'use strict';

app.settingsView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_settingsView
// END_CUSTOM_CODE_settingsView
(function(parent) {
    var  provider = app.data.flashCardsBackend;
    var settingsViewModel = kendo.observable({
        fields: {
            showCard: '',
        },
        submit: function() {},
        cancel: function() {},
        logout: function(event) {
            
            provider.Users.logout(function () {
          //      event.preventDefault();
         //       this.loginView.set("username", "");
           //     this.loginView.set("password", "");
                app.mobileApp.navigate('components/authenticationView/view.html');
            }, function () {
                navigator.notification.alert("Unfortunately an error occurred logging out of your account.");
            });
            console.log(provider.Users);
        },
    });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);

// START_CUSTOM_CODE_settingsViewModel
// END_CUSTOM_CODE_settingsViewModel