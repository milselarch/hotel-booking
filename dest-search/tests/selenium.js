const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");

async function example(){
 
    var searchString = "singapore";

    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();

    //To fetch http://google.com from the browser with our code.
    await driver.get("http://localhost:8080/#/");
    driver.manage().window().maximize();
         
    //To send a search query by passing the value in searchString.
    const search_button= driver.findElement(By.id("search_button"))
    await driver.findElement(By.id("dest_search_field")).sendKeys(searchString);
    await driver.sleep(900);
    await driver.findElement(By.id("dest_search_field")).sendKeys(Key.ARROW_DOWN);
    await driver.sleep(900);
    await driver.findElement(By.id("dest_search_field")).sendKeys(Key.RETURN);

    driver.executeScript("arguments[0].style.border='3px solid red'", search_button);
    await driver.sleep(700);
    driver.executeScript("arguments[0].style.border='none'", search_button);
    driver.findElement(By.id("search_button")).click();

    //print title
    // var title = await driver.getTitle();
    // console.log('Title is:',title);
    for (let i=0; i<3; i++){
        await driver.sleep(1200);
        await driver.executeScript("window.scrollBy({top: 800, behavior: 'smooth'})");
    }
    await driver.sleep(3000);
    await driver.executeScript("window.scrollTo({ top: 700, behavior: 'smooth'})");

    // await driver.wait(until.elementIsVisible(el),100);


    //It is always a safe practice to quit the browser after execution
    await driver.sleep(3000);
    await driver.quit();

}

example();