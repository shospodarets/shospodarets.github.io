import {loadDependency} from '../utils.js';

loadDependency('../dependency.js');// Failed to load resource, as import() is called in ../dependency.js

loadDependency('./dependency.js');// Successfully loaded