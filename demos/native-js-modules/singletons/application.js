import dropdownStatic from './components/dropdown.js';

import('../singletons/components/dropdown.js')
    .then(({default: dropdownDynamic}) => {
        console.log(
            'dropdownStatic === dropdownDynamic',
            dropdownStatic === dropdownDynamic
        );
    });