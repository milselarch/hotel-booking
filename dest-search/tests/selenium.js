const {By,Key,Builder, promise} = require("selenium-webdriver");
require("chromedriver");

async function example(){
 
    var searchString = "singapore";

    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("http://localhost:8080/#/");
    driver.manage().window().maximize();
         
    //To send a search query by passing the value in search.
    const search_button= driver.findElement(By.id("search_button"));
    await driver.findElement(By.id("dest_search_field")).sendKeys(searchString);
    await driver.sleep(900);
    await driver.findElement(By.id("dest_search_field")).sendKeys(Key.ARROW_DOWN);
    await driver.sleep(900);
    await driver.findElement(By.id("dest_search_field")).sendKeys(Key.RETURN);

    driver.executeScript("arguments[0].style.border='3px solid red'", search_button);
    await driver.sleep(700);
    driver.executeScript("arguments[0].style.border='none'", search_button);
    driver.findElement(By.id("search_button")).click();

    for (let i=0; i<3; i++){
        await driver.sleep(1200);
        await driver.executeScript("window.scrollBy({top: 800, behavior: 'smooth'})");
    }
    await driver.sleep(3000);
    await driver.executeScript("window.scrollTo({ top: 700, behavior: 'smooth'})");
    await driver.sleep(1000);

    
    // await driver.wait(until.elementIsVisible(el),100);
    
    await driver.findElements(By.className("card")).then(function(hotels) {
        const valid = [];
        for (let i=0; i<hotels.length; i++){
            ((index) => {
                hotels[index].findElement(By.id("price")).isDisplayed().then((price) => {
                    // console.log(price);
                    if (price) {
                        valid.push(hotels[index]);
                        console.log("pushed", index);
                    }
                    console.log("inner:", valid);
                    valid[0].click();
                });
            })(i);
        }
        console.log("outer:", valid);
        // console.log(valid);
        // valid[0].click();
        // Promise.all(prom1).then((result) => console.log(result));

    });


    for (let i=0; i<3; i++){
        await driver.sleep(1500);
        await driver.executeScript("window.scrollBy({top: 800, behavior: 'smooth'})");
    }

    await driver.sleep(3000);
    await driver.executeScript("window.scrollTo({ top: 0, behavior: 'smooth'})");

    //It is always a safe practice to quit the browser after execution
    await driver.sleep(3000);
    // await driver.quit();

}

example();