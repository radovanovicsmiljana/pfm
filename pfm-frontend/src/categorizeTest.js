const { openBrowser, goto, closeBrowser } = require('taiko');
const assert = require('assert').strict;
(async () => {
    try {
        var randNum = parseInt(Math.random() * (20 - 1) + 1);
        await openBrowser();
        await goto("http://localhost:4200/pfm");
        await click(button({id: 'addsCategory'}));
        await dropDown({id: 'choose_cat'}).select({index: randNum});
        var valueCategory = await dropDown({id: 'choose_cat'}).value();
        var idTransaction = await evaluate(dropDown({id: 'choose_cat'}), (element) => {return element.getAttribute('name')});
        await click("Apply");
        await reload('http://localhost:4200/pfm')
        var newValueCategory = await evaluate(button({id: idTransaction}), (el) => {return el.getAttribute('name')})
        console.log(valueCategory, newValueCategory);
        assert.equal(valueCategory, newValueCategory);
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
