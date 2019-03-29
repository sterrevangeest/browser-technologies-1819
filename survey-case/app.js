console.log("test");

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const port = 4000;

var answerIds = [1, 2, 3];
var answers = [];
var questions = [
  {
    "question-id": 1,
    legend: "Wat is je leeftijd?",
    type: "radio",
    values: [
      { "value-id": 1, answer: "Jonger dan 18 jaar" },
      { "value-id": 2, answer: "18 tot 26 jaar" },
      { "value-id": 3, answer: "26 tot 40 jaar" },
      { "value-id": 4, answer: "40 tot 45 jaar" },
      { "value-id": 5, answer: "56 tot 65 jaar" },
      { "value-id": 6, answer: "Ouder dan 65 jaar" }
    ]
  },
  {
    "question-id": 2,
    legend: "Wat is je hoogst genoten opleiding?",
    type: "radio",
    values: [
      { "value-id": 1, answer: "Basisonderwijs" },
      { "value-id": 2, answer: "Middelbare school" },
      { "value-id": 3, answer: "Middelbaar beroepsonderwijs" },
      { "value-id": 4, answer: "Hoger beroepsonderwijs" },
      { "value-id": 5, answer: "Universitair onderwijs (bachelor)" },
      { "value-id": 6, answer: "Universitair onderwijs (master)" },
      { "value-id": 6, answer: "Universitair onderwijs (doctoraat)" }
    ]
  },
  {
    "question-id": 3,
    legend: "Wat is je postcode",
    type: "zip",
    pattern: "[1-9][0-9]{3}s?[a-zA-Z]{2}"
  }
];

let ejs = require("ejs");
app.use(express.static("static"));
app.use(bodyParser());
app.set("view engine", "ejs");

app.get("/verzenden", function(req, res) {
  console.log(answers);
  var nognietbeantwoord = answers.map(function(item) {
    var questionId = item.questionId;
    return answerIds.find(function(item) {
      if (questionId !== item) {
        console.log("ITEM", item);
        return item;
      }
    });
  });

  console.log(nognietbeantwoord);

  res.render("pages/verzenden", {
    antwoorden: nognietbeantwoord
  });
});

app.get("/index/:id", function(req, res) {
  var id = Number(req.params.id);
  console.log("ID= ", id);

  var findQuestion = questions.find(function(item) {
    // find matching question
    if (item["question-id"] === id) {
      return item;
    }
  });

  var findAnswer = answers.find(function(item) {
    console.log("Answer ID", item["questionId"]);
    if (item["questionId"] === id) {
      console.log(item);
      return item;
    }
  });

  var specificQuestion = findQuestion.values;
  var matchQuestionWithAnswer = specificQuestion.find(function(value) {
    console.log(findAnswer);
    if (findAnswer === undefined) {
      console.log("geen antwoord nog");
    } else if (findAnswer != undefined) {
      if (value["answer"] === findAnswer.value) {
        var checkchecker = specificQuestion.find(function(test) {
          if (test["checked"]) {
            return test;
          }
        });

        if (!checkchecker) {
          value["checked"] = "checked";
        } else if (checkchecker["value-id"]) {
          delete checkchecker["checked"];
          console.log(value);
          value["checked"] = "checked";
          console.log("92", checkchecker);
        }
      }
      if (value["answer"] === findAnswer.value) {
        value["checked"] = "checked";
      }
    }
  });

  res.render("pages/index", {
    data: findQuestion
  });
});

app.post("/index/:id", function(req, res) {
  var id = Number(req.params.id) + 1;
  var question = questions.find(function(item) {
    return item["question-id"] === id;
  });

  var postId = Number(req.params.id);
  var value = req.body[postId];

  console.log(answers.length);
  if (answers.length == 0) {
    console.log("push meteen");
    answers.push({
      questionId: postId,
      value: value
    });
  } else {
    console.log("check eerst even");
    var test = answers.map(function(ids) {
      console.log(ids.questionId);
      console.log(postId);
      if (ids.questionId !== postId) {
        console.log("doe niks");
      } else {
        delete ids.value;
        delete ids.questionId;
        answers.push({
          questionId: postId,
          value: value
        });
        console.log("LAATSTE", answers);
      }
    });
  }

  res.render("pages/index", {
    data: question,
    answer: answers
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
