// Login Form - Selenium Example Script
// see https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs for details
// runs test against http://crossbrowsertesting.github.io/login-form.html
"use strict";
var webdriver = require("selenium-webdriver");
var SeleniumServer = require("selenium-webdriver/remote").SeleniumServer;
var request = require("request");
var remoteHub = "http://hub.crossbrowsertesting.com:80/wd/hub";

var username = "aloera@hatech.io"; //replace with your email address
var authkey = "uf0bb97641eac8ed"; //replace with your authkey

var caps = {
  name: "Login Form Example",
  build: "1.0",
  browserName: "Chrome",
  version: "72",
  platform: "Windows 10",
  screenResolution: "1366x768",
  record_video: "true",
  record_network: "false"
};

caps.username = username;
caps.password = authkey;

var sessionId = null;

console.log("Connection to the CrossBrowserTesting remote server");
async function login() {
  try {
    var driver = new webdriver.Builder()
      .usingServer(remoteHub)
      .withCapabilities(caps)
      .build();

    console.log("Waiting on the browser to be launched and the session to start");

    await driver.getSession().then(function(session) {
      sessionId = session.id_; //need for API calls
      console.log("Session ID: ", sessionId);
      console.log(
        "See your test run at: https://app.crossbrowsertesting.com/selenium/" + sessionId
      );
    });

    //load your URL
    await driver.get("https://karma.hatech.io/login");

    //take snapshot via cbt api
    await driver.takeSnapshot();

    //find checkout and click it
    await driver.findElement(webdriver.By.name("username")).sendKeys("loera140");

    //send keys to element to enter text
    await driver.findElement(webdriver.By.xpath('//*[@type="password"]')).sendKeys("HATech%1234");

    //take snapshot via cbt api
    driver.takeSnapshot();

    //click the archive button
    await driver.findElement(webdriver.By.css("button[type=submit]")).click();

    //wait on logged in message
    await driver.wait(
      webdriver.until.elementLocated(webdriver.By.className("MuiButton-label")),
      10000
    );

    //take snapshot via cbt api
    await driver.takeSnapshot();

    //quit the driver
    await driver.quit();

    //set the score as passing
    setScore("pass").then(function(result) {
      console.log("SUCCESS! set score to pass");
    });
  } catch (e) {
    webdriverErrorHandler(e, driver);
  }
}

jest.setTimeout(30000);
test("", async () => {
  await login();
});

//Call API to set the score
function setScore(score) {
  return new Promise((resolve, fulfill) => {
    var result = { error: false, message: null };

    if (sessionId) {
      request(
        {
          method: "PUT",
          uri: "https://crossbrowsertesting.com/api/v3/selenium/" + sessionId,
          body: { action: "set_score", score: score },
          json: true
        },
        function(error, response, body) {
          if (error) {
            result.error = true;
            result.message = error;
          } else if (response.statusCode !== 200) {
            result.error = true;
            result.message = body;
          } else {
            result.error = false;
            result.message = "success";
          }
        }
      ).auth(username, authkey);
    } else {
      result.error = true;
      result.message = "Session Id was not defined";
      deferred.fulfill(result);
    }

    result.error ? fulfill("Fail") : resolve("Pass");
  });
}

//Call API to get a snapshot
webdriver.WebDriver.prototype.takeSnapshot = function() {
  return new Promise((resolve, fulfill) => {
    var result = { error: false, message: null };

    if (sessionId) {
      request
        .post(
          "https://crossbrowsertesting.com/api/v3/selenium/" + sessionId + "/snapshots",
          function(error, response, body) {
            if (error) {
              result.error = true;
              result.message = error;
            } else if (response.statusCode !== 200) {
              result.error = true;
              result.message = body;
            } else {
              result.error = false;
              result.message = "success";
            }
          }
        )
        .auth(username, authkey);
    } else {
      result.error = true;
      result.message = "Session Id was not defined";
    }

    result.error ? fulfill("Fail") : resolve("Pass"); //never call reject as we don't need this to actually stop the test
  });
};

//general error catching function
function webdriverErrorHandler(err, driver) {
  console.error("There was an unhandled exception! " + err.message);

  //if we had a session, end it and mark failed
  if (driver && sessionId) {
    driver.quit();
    setScore("fail").then(function(result) {
      console.log("FAILURE! set score to fail");
    });
  }
}
