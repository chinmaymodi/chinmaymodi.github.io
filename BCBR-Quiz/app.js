// ============================================================
// STORAGE HELPERS (localStorage -- works on file:// and http://)
// ============================================================

function getData(key) {
  try {
    return localStorage.getItem(key);
  } catch(e) { return null; }
}

function setData(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch(e) {}
}

// ============================================================
// RECORDS (localStorage-backed)
// ============================================================

function loadRecords() {
  var html = '';
  var hasRecords = false;
  var testScore = getData('bcbr_test_score');
  if (testScore) {
    hasRecords = true;
    var pct = parseInt(testScore, 10);
    var cls = pct >= 50 ? 'record-pass' : 'record-fail';
    html += '<div class="record-item"><span class="record-label">Last Full Exam</span><span class="record-val ' + cls + '">' + pct + '%</span></div>';
  }

  var assignScores = getData('bcbr_assignment_scores');
  if (assignScores) {
    var scores = JSON.parse(assignScores);
    var keys = Object.keys(scores).sort(function(a,b) { return parseInt(a,10) - parseInt(b,10); });
    if (keys.length > 0) {
      hasRecords = true;
      html += '<div class="record-item record-header"><span class="record-label">Assignment Records</span><span></span></div>';
      for (var i = 0; i < keys.length; i++) {
        var a = keys[i];
        var p = parseInt(scores[a], 10);
        var c = p >= 50 ? 'record-pass' : 'record-fail';
        html += '<div class="record-item"><span class="record-label">Assignment ' + a + '</span><span class="record-val ' + c + '">' + p + '%</span></div>';
      }
    }
  }

  if (!hasRecords) {
    html = '<div class="record-item" style="color:#999;font-size:13px;">No records yet. Complete a full exam or assignment practice to see scores here.</div>';
  }

  var el = document.getElementById('recordsSection');
  if (el) el.innerHTML = '<div class="records-box">' + html + '</div>';
}

function saveTestScore(pct) {
  setData('bcbr_test_score', '' + pct);
}

function saveAssignmentScore(assignNum, correct, total) {
  var pct = Math.round((correct / total) * 100);
  var assignScores = getData('bcbr_assignment_scores');
  var scores = assignScores ? JSON.parse(assignScores) : {};
  scores[assignNum] = pct;
  setData('bcbr_assignment_scores', JSON.stringify(scores));
}

// Load records on page load
window.addEventListener('DOMContentLoaded', loadRecords);

// ============================================================
// MOBILE / PALETTE HELPERS
// ============================================================

function isMobile() { return window.innerWidth < 768; }

function togglePalette() {
  if (!isMobile()) return;
  document.getElementById('paletteWrap').classList.toggle('collapsed');
  document.getElementById('sidebarTitle').classList.toggle('collapsed');
}

(function() {
  if (window.innerWidth < 768) {
    document.getElementById('paletteWrap').classList.add('collapsed');
    document.getElementById('sidebarTitle').classList.add('collapsed');
  }
})();

window.addEventListener('resize', function() {
  if (!isMobile()) {
    document.getElementById('paletteWrap').classList.remove('collapsed');
    document.getElementById('sidebarTitle').classList.remove('collapsed');
  }
});

// ============================================================
// SHARED
// ============================================================

var ALL_QUESTIONS = window.ALL_QUESTIONS;

function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// VARIANT RESOLUTION
// For each question with variants, randomly pick one variant
// (or keep the original) and replace the question's data.
// Mutates the passed array to avoid modifying ALL_QUESTIONS.
// ============================================================

function resolveVariants(questions) {
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    if (q.variants && q.variants.length > 0) {
      // Pick 0 = original, 1..N = variant index
      var pick = Math.floor(Math.random() * (q.variants.length + 1));
      if (pick > 0) {
        var v = q.variants[pick - 1];
        // Replace with new object so original ALL_QUESTIONS stays untouched
        questions[i] = {
          assignment: q.assignment,
          number: q.number,
          stem: v.stem,
          options: v.options,
          correct: v.correct
        };
      }
    }
  }
}

// ============================================================
// FULL EXAM MODE (unchanged except saveTestScore on submit)
// ============================================================

var questions, answers, review, currentIdx, timerInterval, timeLeft, submitted;

function startQuiz() {
  var s = shuffle(ALL_QUESTIONS.slice());
  resolveVariants(s);
  questions = s.slice(0, 100);
  answers = new Array(100).fill(null);
  review = new Array(100).fill(false);
  currentIdx = 0;
  submitted = false;
  timeLeft = 3 * 3600; // 3 hours in seconds

  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('quizLayout').classList.remove('hidden');
  document.getElementById('resultScreen').style.display = 'none';

  buildPalette();
  showQuestion(0);
  startTimer();
}

function buildPalette() {
  var html = '';
  for (var i = 0; i < 100; i++) {
    html += '<div class="q-num" id="pn' + i + '" onclick="goToQuestion(' + i + ')">' + (i + 1) + '</div>';
  }
  document.getElementById('palette').innerHTML = html;
}

function updatePalette() {
  for (var i = 0; i < 100; i++) {
    var el = document.getElementById('pn' + i);
    el.className = 'q-num';
    if (i === currentIdx) el.classList.add('current');
    else if (review[i] && answers[i] !== null) el.classList.add('review-answered');
    else if (review[i]) el.classList.add('review');
    else if (answers[i] !== null) el.classList.add('answered');
  }
}

function showQuestion(idx) {
  // Collapse palette on mobile when navigating
  if (isMobile()) {
    document.getElementById('paletteWrap').classList.add('collapsed');
    document.getElementById('sidebarTitle').classList.add('collapsed');
  }
  currentIdx = idx;
  var q = questions[idx];
  document.getElementById('qNumber').textContent = 'Question ' + (idx + 1) + ' of 100';
  document.getElementById('qAssignment').textContent = 'A' + q.assignment + ' Q' + q.number;
  document.getElementById('qStem').textContent = q.stem;

  var html = '';
  for (var i = 0; i < q.options.length; i++) {
    var opt = q.options[i];
    var sel = answers[idx] === opt.letter ? 'selected' : '';
    var letter = opt.letter.toUpperCase();
    html += '<div class="q-option ' + sel + '" data-letter="' + opt.letter + '" onclick="selectOption(' + idx + ',\'' + opt.letter + '\')">' +
      '<span class="opt-letter">' + letter + '</span>' +
      '<span class="opt-text">' + esc(opt.text) + '</span></div>';
  }
  document.getElementById('qOptions').innerHTML = html;
  updatePalette();
  document.getElementById('clearBtn').disabled = (answers[idx] === null);
  document.getElementById('prevBtn').disabled = (idx === 0);
  document.getElementById('nextBtn').disabled = (idx === 99);
  window.scrollTo(0, 0);
}

// ============================================================
// ASSIGNMENT PRACTICE MODE
// ============================================================

var practiceQuestions, practiceAnswers, practiceCurrentIdx, practiceAssignNum;

function showAssignmentPicker() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('assignmentPickerScreen').style.display = 'block';

  // Build the assignment grid if not already built
  var grid = document.getElementById('assignGrid');
  if (grid.children.length === 0) {
    var html = '';
    for (var i = 1; i <= 23; i++) {
      html += '<div class="assign-btn" onclick="startAssignmentPractice(' + i + ')">' +
        '<span class="assign-num">' + i + '</span>' +
        '<span class="assign-label">Assignment ' + i + '</span>' +
        '</div>';
    }
    grid.innerHTML = html;
  }
}

function hideAssignmentPicker() {
  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
}

function startAssignmentPractice(assignNum) {
  practiceAssignNum = assignNum;
  practiceQuestions = ALL_QUESTIONS.filter(function(q) { return q.assignment === assignNum; });
  resolveVariants(practiceQuestions);
  // Shuffle the questions for varied practice
  shuffle(practiceQuestions);
  practiceAnswers = new Array(practiceQuestions.length).fill(null);
  practiceCurrentIdx = 0;

  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('practiceLayout').classList.remove('hidden');
  document.getElementById('practiceResultScreen').style.display = 'none';

  showPracticeQuestion(0);
}

function renderPracticeFeedback(idx, q) {
  var opts = document.querySelectorAll('#pQOptions .q-option');
  var answeredLetter = practiceAnswers[idx];

  for (var i = 0; i < opts.length; i++) {
    var optLetter = opts[i].getAttribute('data-letter');
    opts[i].style.pointerEvents = 'none';
    opts[i].className = 'q-option';
    opts[i].querySelector('.opt-letter').className = 'opt-letter';
    opts[i].querySelector('.opt-text').className = 'opt-text';

    if (optLetter === q.correct) {
      opts[i].classList.add('practice-correct');
      opts[i].querySelector('.opt-letter').classList.add('practice-correct');
      opts[i].querySelector('.opt-text').classList.add('practice-correct');
    } else if (optLetter === answeredLetter && answeredLetter !== q.correct) {
      opts[i].classList.add('practice-wrong');
      opts[i].querySelector('.opt-letter').classList.add('practice-wrong');
      opts[i].querySelector('.opt-text').classList.add('practice-wrong');
    }
  }

  // Show feedback
  var fb = document.getElementById('feedbackBox');
  var icon = document.getElementById('feedbackIcon');
  var text = document.getElementById('feedbackText');
  fb.classList.remove('hidden');

  var isCorrect = (answeredLetter === q.correct);
  if (isCorrect) {
    icon.textContent = 'Correct!';
    icon.className = 'feedback-icon feedback-correct';
    text.textContent = 'Good job!';
    text.className = 'feedback-text feedback-correct';
  } else {
    icon.textContent = 'Wrong';
    icon.className = 'feedback-icon feedback-wrong';
    var correctLetter = q.correct.toUpperCase();
    var correctText = '';
    for (var j = 0; j < q.options.length; j++) {
      if (q.options[j].letter === q.correct) { correctText = q.options[j].text; break; }
    }
    text.textContent = 'Your answer: ' + (answeredLetter ? answeredLetter.toUpperCase() : 'None') + '. Correct: ' + correctLetter + '. ' + correctText;
    text.className = 'feedback-text feedback-wrong';
  }
}

function showPracticeQuestion(idx) {
  practiceCurrentIdx = idx;
  var q = practiceQuestions[idx];
  var total = practiceQuestions.length;

  document.getElementById('pQNumber').textContent = 'Question ' + (idx + 1) + ' of ' + total;
  document.getElementById('pQAssignment').textContent = 'A' + q.assignment + ' Q' + q.number;
  document.getElementById('pQStem').textContent = q.stem;
  document.getElementById('practiceProgress').textContent = (idx + 1) + ' / ' + total;

  var html = '';
  for (var i = 0; i < q.options.length; i++) {
    var opt = q.options[i];
    var letter = opt.letter.toUpperCase();
    html += '<div class="q-option" data-letter="' + opt.letter + '">' +
      '<span class="opt-letter">' + letter + '</span>' +
      '<span class="opt-text">' + esc(opt.text) + '</span></div>';
  }
  document.getElementById('pQOptions').innerHTML = html;

  // Update prev/next button states
  document.getElementById('pPrevBtn').disabled = (idx === 0);
  document.getElementById('pNextBtn').disabled = (idx === total - 1);

  if (practiceAnswers[idx] !== null) {
    // Already answered: show feedback read-only, disable options
    renderPracticeFeedback(idx, q);
  } else {
    // Not answered: make options clickable, hide feedback
    document.getElementById('feedbackBox').classList.add('hidden');
    var opts = document.querySelectorAll('#pQOptions .q-option');
    for (var i = 0; i < opts.length; i++) {
      opts[i].style.pointerEvents = 'auto';
      opts[i].style.cursor = 'pointer';
      (function(optEl, qIdx) {
        optEl.onclick = function() { selectPracticeOption(qIdx, optEl.getAttribute('data-letter')); };
      })(opts[i], idx);
    }
  }

  window.scrollTo(0, 0);
}

function selectPracticeOption(idx, letter) {
  if (practiceAnswers[idx] !== null) return;

  var q = practiceQuestions[idx];
  practiceAnswers[idx] = letter;
  renderPracticeFeedback(idx, q);
}

function nextPracticeQuestion() {
  if (practiceCurrentIdx < practiceQuestions.length - 1) {
    showPracticeQuestion(practiceCurrentIdx + 1);
  }
}

function prevPracticeQuestion() {
  if (practiceCurrentIdx > 0) {
    showPracticeQuestion(practiceCurrentIdx - 1);
  }
}

function finishPractice() {
  var correct = 0, wrong = 0, wrongDetails = [];
  for (var i = 0; i < practiceQuestions.length; i++) {
    if (practiceAnswers[i] === practiceQuestions[i].correct) { correct++; }
    else {
      wrong++;
      wrongDetails.push({ idx: i, q: practiceQuestions[i], your: practiceAnswers[i], correctA: practiceQuestions[i].correct });
    }
  }
  var total = practiceQuestions.length;
  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 50;

  // Save record
  saveAssignmentScore(practiceAssignNum, correct, total);

  document.getElementById('practiceLayout').classList.add('hidden');
  document.getElementById('practiceResultScreen').style.display = 'block';

  var se = document.getElementById('pScoreDisplay');
  se.textContent = pct + '%';
  se.className = 'score ' + (passed ? 'pass' : 'fail');
  document.getElementById('pScoreLabel').textContent = passed ? 'PASSED!' : 'Keep practicing.';
  document.getElementById('pCorrectCount').textContent = correct;
  document.getElementById('pWrongCount').textContent = wrong;
  document.getElementById('pTotalCount').textContent = total;

  var wl = document.getElementById('pWrongList');
  if (wrongDetails.length === 0) {
    wl.innerHTML = '<p style="color:#2e7d32;font-size:16px;text-align:center;">Perfect score! All answers correct.</p>';
  } else {
    var h = '';
    for (var w = 0; w < wrongDetails.length; w++) {
      var d = wrongDetails[w];
      var q = d.q;
      var gq = encodeURIComponent(topicQuery(q));
      h += '<div class="wrong-card">' +
        '<div class="q-assign"><span>A' + q.assignment + ' Q' + q.number + '</span></div>' +
        '<div class="q-status">' +
        '<span class="badge-yours">Your answer: ' + (d.your ? d.your.toUpperCase() : 'None') + '</span>' +
        '<span class="badge-correct">Correct: ' + d.correctA.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="q-text">' + esc(q.stem) + '</div>';
      for (var oi = 0; oi < q.options.length; oi++) {
        var opt = q.options[oi];
        var cls = 'review-option neutral';
        if (opt.letter === d.correctA) cls = 'review-option correct';
        if (opt.letter === d.your && opt.letter !== d.correctA) cls = 'review-option wrong';
        h += '<div class="' + cls + '">' +
          '<span class="opt-letter">' + opt.letter.toUpperCase() + '</span>' +
          '<span class="opt-text">' + esc(opt.text) + '</span></div>';
      }
      h += '<a class="google-btn" href="https://www.google.com/search?q=' + gq + '" target="_blank">Search Topic</a>' +
        '</div>';
    }
    wl.innerHTML = h;
  }
  window.scrollTo(0, 0);
}

// ============================================================
// THEME TOGGLE (dark/light mode with localStorage persistence)
// ============================================================

function toggleTheme() {
  var body = document.body;
  body.classList.toggle('dark');
  setData('bcbr_theme', body.classList.contains('dark') ? 'dark' : 'light');
}

function initTheme() {
  var saved = getData('bcbr_theme');
  if (saved === 'light') {
    return; // user explicitly switched to light, respect it
  }
  document.body.classList.add('dark');
  if (!saved) {
    setData('bcbr_theme', 'dark');
  }
}

initTheme();

function exitPractice() {
  if (confirm('Exit practice? Your progress for this session will be lost.')) {
    document.getElementById('practiceLayout').classList.add('hidden');
    document.getElementById('startScreen').style.display = 'block';
    loadRecords();
  }
}

function retryPractice() {
  document.getElementById('practiceResultScreen').style.display = 'none';
  startAssignmentPractice(practiceAssignNum);
}

function backToMenu() {
  document.getElementById('practiceResultScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
  loadRecords();
}

function backToMenuFromExam() {
  document.getElementById('resultScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
  loadRecords();
}

function selectOption(idx, letter) {
  answers[idx] = letter;
  var opts = document.querySelectorAll('.q-option');
  for (var i = 0; i < opts.length; i++) {
    var isSel = opts[i].getAttribute('data-letter') === letter;
    opts[i].className = 'q-option' + (isSel ? ' selected' : '');
    opts[i].querySelector('.opt-letter').className = 'opt-letter' + (isSel ? ' selected' : '');
    opts[i].querySelector('.opt-text').className = 'opt-text' + (isSel ? ' selected' : '');
  }
  updatePalette();
  document.getElementById('clearBtn').disabled = false;
}

function clearResponse() {
  answers[currentIdx] = null;
  // Re-render
  var opts = document.querySelectorAll('.q-option');
  for (var i = 0; i < opts.length; i++) {
    opts[i].className = 'q-option';
    opts[i].querySelector('.opt-letter').className = 'opt-letter';
    opts[i].querySelector('.opt-text').className = 'opt-text';
  }
  updatePalette();
  document.getElementById('clearBtn').disabled = true;
}

function saveAndNext() {
  if (answers[currentIdx] === null) {
    alert('Please select an answer before saving.');
    return;
  }
  if (currentIdx < 99) { showQuestion(currentIdx + 1); }
}

function markReview() {
  review[currentIdx] = true;
  // If no answer selected, that's fine - it's marked for review
  if (currentIdx < 99) { showQuestion(currentIdx + 1); }
  else { updatePalette(); }
}

function goToQuestion(idx) {
  showQuestion(idx);
}

function prevQuestion() {
  if (currentIdx > 0) showQuestion(currentIdx - 1);
}

function nextQuestion() {
  if (currentIdx < 99) showQuestion(currentIdx + 1);
}

// Keyboard navigation (exam + practice)
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    var quizLayout = document.getElementById('quizLayout');
    var practiceLayout = document.getElementById('practiceLayout');
    if (!quizLayout.classList.contains('hidden') && !submitted) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') prevQuestion();
      else nextQuestion();
    } else if (!practiceLayout.classList.contains('hidden')) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') prevPracticeQuestion();
      else nextPracticeQuestion();
    }
  }
});

function startTimer() {
  timerInterval = setInterval(function() {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
      return;
    }
    var h = Math.floor(timeLeft / 3600);
    var m = Math.floor((timeLeft % 3600) / 60);
    var s = timeLeft % 60;
    var str = pad(h) + ':' + pad(m) + ':' + pad(s);
    document.getElementById('timerDisplay').textContent = str;
    if (timeLeft < 300) { // last 5 min
      document.getElementById('timerDisplay').classList.add('warning');
    }
  }, 1000);
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function topicQuery(q) {
  // Extract key topic words from the stem for a targeted Google search.
  // Strip common question prefixes and keep meaningful content words.
  var s = q.stem;
  // Remove common question phrasing
  s = s.replace(/^(which of the following |what is |what are |how |the following |all the following |which one of the following |which of these |which statistic |which measure |which method |which |the )/i, '');
  s = s.replace(/^.+?is (not |also )?/i, '');
  s = s.replace(/^(true|false)/i, '');
  s = s.replace(/[^a-zA-Z0-9 ]/g, ' ');
  // Collapse whitespace and take first ~6 meaningful words
  var words = s.split(/\s+/).filter(function(w) {
    return w.length > 2 && !/^(the|and|for|are|was|but|not|all|any|has|had|its|can|may|per|each|with|from|than|that|this|which|what|when|where|how)$/i.test(w);
  });
  var key = words.slice(0, 6).join(' ');
  if (key.length < 5) {
    // Fallback: first 60 chars of cleaned stem
    key = q.stem.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().substring(0, 60);
  }
  return 'BCBR biomedical research ' + key;
}

function submitQuiz() {
  if (submitted) return;
  var unatt = 0;
  for (var i = 0; i < 100; i++) { if (answers[i] === null) unatt++; }
  var msg = 'Are you sure you want to submit?';
  if (unatt > 0) msg += '\n' + unatt + ' question(s) not answered.';
  if (review.some(function(v) { return v; })) msg += '\n' + review.filter(function(v) { return v; }).length + ' question(s) marked for review.';
  if (!confirm(msg)) return;

  submitted = true;
  clearInterval(timerInterval);
  document.getElementById('quizLayout').classList.add('hidden');
  document.getElementById('resultScreen').style.display = 'block';

  var correct = 0, wrong = 0, wrongDetails = [];
  for (var i = 0; i < 100; i++) {
    if (answers[i] === questions[i].correct) { correct++; }
    else { wrong++;
      wrongDetails.push({ idx: i, q: questions[i], your: answers[i], correctA: questions[i].correct });
    }
  }
  var pct = Math.round((correct / 100) * 100);
  var passed = pct >= 50;

  var se = document.getElementById('scoreDisplay');
  se.textContent = pct + '%';
  se.className = 'score ' + (passed ? 'pass' : 'fail');
  document.getElementById('scoreLabel').textContent = passed ? 'PASSED! Minimum 50% required.' : 'Below 50% - Keep practicing.';
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('wrongCount').textContent = wrong;
  document.getElementById('answeredCount').textContent = correct + wrong;

  saveTestScore(pct);

  var wl = document.getElementById('wrongList');
  if (wrongDetails.length === 0) {
    wl.innerHTML = '<p style="color:#2e7d32;font-size:16px;text-align:center;">Perfect score! All answers correct.</p>';
  } else {
    var h = '';
    for (var w = 0; w < wrongDetails.length; w++) {
      var d = wrongDetails[w];
      var q = d.q;
      var gq = encodeURIComponent(topicQuery(q));
      h += '<div class="wrong-card">' +
        '<div class="q-assign"><span>A' + q.assignment + ' Q' + q.number + '</span></div>' +
        '<div class="q-status">' +
        '<span class="badge-yours">Your answer: ' + (d.your ? d.your.toUpperCase() : 'None') + '</span>' +
        '<span class="badge-correct">Correct: ' + d.correctA.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="q-text">' + esc(q.stem) + '</div>';
      // Render all options
      for (var oi = 0; oi < q.options.length; oi++) {
        var opt = q.options[oi];
        var cls = 'review-option neutral';
        if (opt.letter === d.correctA) cls = 'review-option correct';
        if (opt.letter === d.your && opt.letter !== d.correctA) cls = 'review-option wrong';
        h += '<div class="' + cls + '">' +
          '<span class="opt-letter">' + opt.letter.toUpperCase() + '</span>' +
          '<span class="opt-text">' + esc(opt.text) + '</span></div>';
      }
      h += '<a class="google-btn" href="https://www.google.com/search?q=' + gq + '" target="_blank">Search Topic</a>' +
        '</div>';
    }
    wl.innerHTML = h;
  }
  window.scrollTo(0, 0);
}