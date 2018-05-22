// PAINT WORKLET
CSS.paintWorklet.addModule('./js/triangle-chart-worklet.js');

// // VARS
// const pieChartFromInputsEl = document.querySelector('.pie-chart-from-inputs');
// const chartSectionsEl = document.querySelector('.chart-sections');
// const btnAddSectionEl = document.querySelector('.btn-add-section');
// const btnRemoveSectionEl = document.querySelector('.btn-remove-section');
//
// const pieChartInputsQuery = 'input';
//
// // METHODS
// function getPieChartInputs() {
//     return Array.from(
//         document.querySelectorAll(pieChartInputsQuery)
//     );
// }
//
// function setPieChartValuesFromInputs() {
//     getPieChartInputs().forEach((pieChartInput) => {
//         const cssPropertyName = pieChartInput.name;
//         const cssPropertyValue = pieChartInput.value;
//
//         pieChartFromInputsEl.style.setProperty(`--${cssPropertyName}`, cssPropertyValue);
//     });
// }
//
// function getChartCssPropertyValue(chartSections, valueType) {
//     return chartSections.reduce(
//         (accumulator, currentValue, i) => {
//             return accumulator + (i ? `, ` : '') + `var(--pie-${valueType}-${i + 1})`;
//         }, '')
// }
//
// function getCurrentSections() {
//     return Array.from(document.querySelectorAll('.chart-section'));
// }
//
// function applyCurrentSections() {
//     const chartSections = getCurrentSections();
//
//     // Populate CSS Props to transfer info to the Worklet about the pieces
//     // E.g. --pie-values: var(--pie-value-1), var(--pie-value-2), ...;
//     pieChartFromInputsEl.style.setProperty(`--pie-values`, getChartCssPropertyValue(chartSections, 'value'));
//     // E.g. --pie-colors: var(--pie-color-1), var(--pie-color-2), ...;
//     pieChartFromInputsEl.style.setProperty(`--pie-colors`, getChartCssPropertyValue(chartSections, 'color'));
//
//     // hide the remove button if there is only one section left
//     if (chartSections.length === 1) { // don't show btn if there is only one row
//         btnRemoveSectionEl.style.display = 'none';
//         return;
//     } else {
//         btnRemoveSectionEl.style.display = '';
//     }
//
//     setPieChartValuesFromInputs();
// }
//
// function getRandomHexColor() {
//     const hexValues = '0123456789ABCDEF';
//     let hexcolor = '#';
//     for (let i = 0; i < 6; i++) {
//         hexcolor += hexValues[Math.floor(Math.random() * 16)];
//     }
//     return hexcolor;
// }
//
// function addSection() {
//     const newSectionNumber = getCurrentSections().length + 1;
//
//     // <template /> is not used as Chrome will throw console warning trying apply Worklets to the cloned content
//     let template = document.querySelector('.chart-section-template').innerHTML;
//     template = template.replace(/%COLOR%/g, getRandomHexColor());
//     template = template.replace(/%NUMBER%/g, newSectionNumber);
//
//     const templateWrapper = document.createElement('div');
//     templateWrapper.innerHTML = template;
//     const updateTemplateEl = templateWrapper.firstElementChild;
//
//     chartSectionsEl.appendChild(updateTemplateEl);
//
//     applyCurrentSections();
// }
//
// function removeLastSection() {
//     const lastSectionEl = chartSectionsEl.lastElementChild;
//
//     const pieChartInputsInLastSection = Array.from(
//         lastSectionEl.querySelectorAll(pieChartInputsQuery)
//     );
//
//     pieChartInputsInLastSection.forEach((pieChartInput) => {
//         pieChartFromInputsEl.style.removeProperty(`--${pieChartInput.name}`);
//     });
//
//     lastSectionEl.remove();
//
//     applyCurrentSections();
// }
//
// // EVENTS
// // Chart Data Input Changes listener
// document.addEventListener("input", function (e) {// listen any remove section btn click
//     if (!e.target.matches(pieChartInputsQuery)) {
//         return;
//     }
//
//     setPieChartValuesFromInputs();
// });
//
// btnAddSectionEl.addEventListener('click', addSection);
// btnRemoveSectionEl.addEventListener('click', removeLastSection);
//
// // INIT
// applyCurrentSections();