new Worker('worker.js', {type: 'module'});

navigator.serviceWorker.register(
    'service-worker.js',
    {type: 'module'});