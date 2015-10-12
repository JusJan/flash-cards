'use strict';

app.settingsView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_settingsView
// END_CUSTOM_CODE_settingsView
(function(parent) {
    var settingsViewModel = kendo.observable({
        fields: {
            showCard: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);

// START_CUSTOM_CODE_settingsViewModel
// END_CUSTOM_CODE_settingsViewModel