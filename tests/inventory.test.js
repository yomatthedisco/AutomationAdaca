const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const LoginPage = require("../pages/login.page");
const InventoryPage = require("../pages/inventory.page");
const testData = require("../test-data/user_credentials.json");

describe("Inventory Page Tests", function () {
  this.timeout(60000);

  let driver;
  let loginPage;
  let inventoryPage;

  before(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  // Capture screenshot for every test (passed or failed) and attach to mochawesome
  afterEach(async function () {
    if (this.currentTest && driver) {
      try {
        const { saveScreenshot } = require("../utils/driver");
        const addContext = require("mochawesome/addContext");
        const state = this.currentTest.state || "unknown";
        const safeName = `${this.currentTest.title}__${state}`.replace(/[^a-z0-9\-]/gi, "_").toLowerCase();
        const destUnderReport = `mochawesome-report/screenshots/${safeName}.png`;
        await saveScreenshot(driver, destUnderReport);
        const reportRelativePath = `screenshots/${safeName}.png`;
        addContext(this, reportRelativePath);
      } catch (err) {
        console.warn("[WARN] Could not capture screenshot:", err && err.message ? err.message : err);
      }
    }
  });

  it("Add to cart single item scenario", async function () {
    const itemName = "Sauce Labs Backpack";
    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    console.log("Verifying landed on Swag Labs page...");
    expect(await inventoryPage.isAtInventoryPage()).to.be.true;

    console.log(`Adding item to cart: ${itemName}`);
    await inventoryPage.addToCartByName(itemName);

    console.log("Verifying Remove button visible...");
    const removeVisible = await inventoryPage.isRemoveButtonVisible(itemName);
    expect(removeVisible).to.be.true;

    console.log("Clicking cart button...");
    await inventoryPage.clickCart();

    console.log("Verifying at Cart page...");
    expect(await inventoryPage.isAtCartPage()).to.be.true;

    console.log("Verifying item present in cart...");
    expect(await inventoryPage.isItemInCart(itemName)).to.be.true;
  });

  it("Delete an item in Product Page", async function () {
    const itemName = "Sauce Labs Backpack";
    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    expect(await inventoryPage.isAtInventoryPage()).to.be.true;

    await inventoryPage.addToCartByName(itemName);
    expect(await inventoryPage.isRemoveButtonVisible(itemName)).to.be.true;

    console.log("Removing the item from product page...");
    await inventoryPage.removeFromCartByName(itemName);

    // After remove, the remove button should no longer be present; the add button should be present instead
    const stillRemoveVisible = await inventoryPage.isRemoveButtonVisible(itemName);
    expect(stillRemoveVisible).to.be.false;
  });
});
