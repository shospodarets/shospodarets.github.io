export const loadDependency = (src) => {
    return import(src)
        .then((module) => {
            console.log('dependency is loaded');
            return module;
        })
};