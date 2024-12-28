var quizList = [];
var answerList = [];
var score = 0;

$.getJSON("quiz.json", (data) => quizList = data);

$(function() {
    $("#quizBox").hide();
    $("#quizResult").hide();
    $("#btnRedoQuiz").hide();
    
    $("#btnStart").click(function() {
        $("#back-btn").show();
        $("#startBox").hide();
        $("#quizBox").show();
        $("#quizListBox").empty();
        displayQuizList();
    });

    $("#btnCheckAnswer").click(function() {
        if (checkAllAnswered()) {
            submitQuiz();
        }
    });

    $("#btnRedoQuiz").click(function() {
        score = 0;
        answerList = [];
        $("#quizResult").hide();
        $("#quizBox").show();
        $("#quizListBox").empty();
        displayQuizList();
        $("#back-btn").show();
    });

    $("#back-btn").click(function() {
        $("#quizListBox").hide();
        $("#btnCheckAnswer").hide();
        $("#startBox").show();
        $("#back-btn").hide();
    });

    $("#home-btn").click(function() {
        $("#quizListBox").hide();
        $("#btnCheckAnswer").hide();
        $("#quizResult").hide();
        $("#startBox").show();
    });
});

function displayQuizList() {
    for (var i in quizList) {
        displayQuiz(i, quizList[i]);
    }
    $("#quizListBox").show();
    $("#btnCheckAnswer").show();
    $("#back-btn").show();
}

function displayQuiz(i, q) {
    var no = parseInt(i) + 1;
    var html = "<div class='col-12 p-4'>ข้อที่ " + no + ".<h4 class='pt-2 pb-2'>" + q.question + "</h4>";
    for (var c in q.options) {
        var v = parseInt(c) + 1;
        html += "<div class='alert alert-light'>";
        html += "<input type='radio' name='q" + no + "' value='" + v + "'> " + v + ". ";
        html += q.options[c] + "</div>";
    }
    html += "</div>";
    $("#quizListBox").append(html);
}

function checkAllAnswered() {
    for (var i = 0; i < quizList.length; i++) {
        var selectedAnswer = $("input[name='q" + (i + 1) + "']:checked").val();
        if (!selectedAnswer) {
            alert("กรุณาตอบคำถามให้ครบทุกข้อ");
            return false;
        }
    }
    return true;
}

function submitQuiz() {
    score = 0;
    for (var i = 0; i < quizList.length; i++) {
        var selectedAnswer = $("input[name='q" + (i + 1) + "']:checked").val();
        var correctAnswer = quizList[i].answer + 1;
        if (selectedAnswer == correctAnswer) {
            score++;
        }
    }
    showResult();
}

function showResult() {
    $("#quizListBox").hide();
    $("#btnCheckAnswer").hide();
    $("#back-btn").hide();
    $("#quizResult").show();
    $("#btnRedoQuiz").show();
    $("#score").html("<h3 class='pt-2 pb-2 text-center'>คะแนนของคุณ: " + score + " / " + quizList.length + "</h3>");
}
