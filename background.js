var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted', 'onDOMContentLoaded',
    'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
    'onHistoryStateUpdated'];

eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(data) {
    if (typeof data)
      console.log('date', chrome.i18n.getMessage('inHandler'), e, data);
    else
      console.error('else', chrome.i18n.getMessage('inHandlerError'), e);
  });
});