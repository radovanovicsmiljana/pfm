const { openBrowser, goto, click, dropDown, textBox, into, write, button, closeBrowser } = require('taiko');
const assert = require('assert').strict;
(async () => {
    try {
        var randNum = parseInt(Math.random() * (20 - 1) + 1);
        await openBrowser();
        await goto("http://localhost:4200/pfm");
        var amount = await evaluate($('.a-name'), (element) => {return element.getAttribute('id')});
        var num = parseFloat(amount.split(' ')[0])
        var split = num / 2;
        await click("Split transaction");
        var idTransaction = await evaluate(dropDown({id: 0}), (element) => {return element.getAttribute('name')});
        await dropDown({id: 0}).select({index: randNum});
        await write(split, into(textBox({id: 0}),{force:true}));
        await dropDown({id: 1}).select({index: randNum});
        await write(split, into(textBox({id: 1}),{force:true}));
        await click('Apply');
        await reload('http://localhost:4200/pfm')
        var buttonText = await evaluate(button({name: idTransaction}), (element) => {return element.getAttribute('value')});
        await assert.equal(buttonText, "Show splits")
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
