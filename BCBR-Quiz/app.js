"use strict";

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

function removeData(key) {
  try { localStorage.removeItem(key); } catch(e) {}
}

// ============================================================
// EXAM STATE PERSISTENCE (resume on refresh / browser restart)
// ============================================================

var STATE_EXAM_KEY = 'bcbr_exam_state';
var STATE_PRACTICE_KEY = 'bcbr_practice_state';

function saveExamState() {
  // Only save if exam is in progress (not submitted, quiz layout visible)
  if (submitted || !questions) return;
  var state = {
    questions: questions,
    answers: answers,
    review: review,
    currentIdx: currentIdx,
    timeLeft: timeLeft
  };
  setData(STATE_EXAM_KEY, JSON.stringify(state));
}

function loadExamState() {
  var raw = getData(STATE_EXAM_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}

function clearExamState() {
  removeData(STATE_EXAM_KEY);
}

function savePracticeState() {
  if (!practiceQuestions) return;
  var state = {
    assignNum: practiceAssignNum,
    questions: practiceQuestions,
    answers: practiceAnswers,
    review: practiceReview,
    currentIdx: practiceCurrentIdx
  };
  setData(STATE_PRACTICE_KEY, JSON.stringify(state));
}

function loadPracticeState() {
  var raw = getData(STATE_PRACTICE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}

function clearPracticeState() {
  removeData(STATE_PRACTICE_KEY);
}

// ============================================================
// RESUME / DISCARD handlers
// ============================================================

function resumeExam() {
  var state = loadExamState();
  if (!state) { loadRecords(); return; }

  questions = state.questions;
  answers = state.answers;
  review = state.review;
  currentIdx = state.currentIdx;
  timeLeft = state.timeLeft;
  submitted = false;

  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('quizLayout').classList.remove('hidden');
  document.getElementById('resultScreen').style.display = 'none';

  // Reset sidebar to visible on resume
  document.getElementById('sidebar').classList.remove('collapsed');
  document.getElementById('sidebarToggle').textContent = '<<';

  buildPalette();
  showQuestion(currentIdx);

  if (timeLeft > 0) {
    startTimer();
  } else {
    // Time already expired -- auto-submit without confirm
    submitQuiz(true);
  }
}

function discardExam() {
  if (confirm('Discard your in-progress exam? Your answers for this session will be lost.')) {
    clearExamState();
    loadRecords();
  }
}

function resumePractice() {
  var state = loadPracticeState();
  if (!state) { loadRecords(); return; }

  practiceAssignNum = state.assignNum;
  practiceQuestions = state.questions;
  practiceAnswers = state.answers;
  practiceReview = state.review || new Array(practiceQuestions.length).fill(false);
  practiceCurrentIdx = state.currentIdx;

  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('practiceLayout').classList.remove('hidden');
  document.getElementById('practiceResultScreen').style.display = 'none';

  buildPPalette();
  showPracticeQuestion(practiceCurrentIdx);
}

function discardPractice() {
  if (confirm('Discard your in-progress practice session? Your progress will be lost.')) {
    clearPracticeState();
    loadRecords();
  }
}

// ============================================================
// RECORDS (localStorage-backed)
// ============================================================

function loadRecords() {
  var html = '';
  var hasRecords = false;

  // Check for resume-able sessions (before records)
  var examState = loadExamState();
  var practiceState = loadPracticeState();
  if (examState) {
    hasRecords = true;
    var h = Math.floor(examState.timeLeft / 3600);
    var m = Math.floor((examState.timeLeft % 3600) / 60);
    html += '<div class="record-item resume-item">' +
      '<span class="record-label resume-label">&#9654; Exam in progress (' + h + 'h ' + m + 'm left)</span>' +
      '<button class="resume-btn" onclick="resumeExam()">Resume</button>' +
      '<button class="resume-btn discard-btn" onclick="discardExam()">Discard</button>' +
      '</div>';
  }

  if (practiceState) {
    hasRecords = true;
    html += '<div class="record-item resume-item">' +
      '<span class="record-label resume-label">&#9654; Assignment ' + practiceState.assignNum + ' practice in progress</span>' +
      '<button class="resume-btn" onclick="resumePractice()">Resume</button>' +
      '<button class="resume-btn discard-btn" onclick="discardPractice()">Discard</button>' +
      '</div>';
  }

  // Full exam history
  var examHistory = getData('bcbr_exam_history');
  var exams = [];
  if (examHistory) { try { exams = JSON.parse(examHistory); } catch(e) {} }

  if (exams.length > 0) {
    hasRecords = true;
    html += '<div class="record-item record-header"><span class="record-label">Exam History</span><span></span></div>';
    // Show most recent first
    for (var hi = exams.length - 1; hi >= 0; hi--) {
      var ex = exams[hi];
      var cls = ex.score >= 50 ? 'record-pass' : 'record-fail';
      var d = new Date(ex.date);
      var dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      html += '<div class="record-item exam-record-item">' +
        '<span class="record-label">' + dateStr + '</span>' +
        '<span class="record-val ' + cls + '">' + ex.score + '%</span>' +
        '<div class="exam-record-actions">' +
        '<button class="resume-btn view-btn" onclick="viewExamHistory(' + hi + ')">View</button>' +
        '<button class="resume-btn delete-rec-btn" onclick="deleteExamHistory(' + hi + ')">Delete</button>' +
        '</div>' +
        '</div>';
    }
  } else {
    // Fallback for old-format single score (before full history existed)
    var testScore = getData('bcbr_test_score');
    if (testScore) {
      hasRecords = true;
      var pct = parseInt(testScore, 10);
      var cls = pct >= 50 ? 'record-pass' : 'record-fail';
      html += '<div class="record-item"><span class="record-label">Last Full Exam</span><span class="record-val ' + cls + '">' + pct + '%</span></div>';
    }
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

function saveExamHistory(pct, correct, wrong, wrongDetails) {
  // Keep the old single-score key for backward compat
  setData('bcbr_test_score', '' + pct);

  // Full history record
  var history = [];
  var raw = getData('bcbr_exam_history');
  if (raw) { try { history = JSON.parse(raw); } catch(e) {} }

  history.push({
    date: new Date().toISOString(),
    score: pct,
    correct: correct,
    wrong: wrong,
    total: 100,
    wrongDetails: wrongDetails
  });

  // Keep last 50 exams
  if (history.length > 50) { history = history.slice(-50); }
  setData('bcbr_exam_history', JSON.stringify(history));
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
// MOBILE HELPER
// ============================================================

function isMobile() { return window.innerWidth < 768; }

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
  // Discard any previous saved state when starting fresh
  clearExamState();
  clearPracticeState();

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

  // Reset sidebar to visible
  document.getElementById('sidebar').classList.remove('collapsed');
  document.getElementById('sidebarToggle').textContent = '<<';

  buildPalette();
  showQuestion(0);
  startTimer();
}

function buildPalette() {
  var html = '';
  for (var i = 0; i < 100; i++) {
    html += '<div class="q-num not-answered" id="pn' + i + '" onclick="goToQuestion(' + i + ')">' + (i + 1) + '</div>';
  }
  document.getElementById('palette').innerHTML = html;
}

function updatePalette() {
  for (var i = 0; i < 100; i++) {
    var el = document.getElementById('pn' + i);
    var isAns = answers[i] !== null;
    var isBm = review[i];
    var isCur = i === currentIdx;
    el.className = 'q-num';
    if (isCur) el.classList.add('current');
    if (isAns && isBm) el.classList.add('ans-bookmarked');
    else if (isAns) el.classList.add('answered');
    else if (isBm) el.classList.add('not-ans-bookmarked');
    else el.classList.add('not-answered');
  }
}

function updateSummary() {
  var total = 100;
  var ans = 0, ansBm = 0, notAnsBm = 0;
  for (var i = 0; i < total; i++) {
    var isAns = answers[i] !== null;
    var isBm = review[i];
    if (isAns && isBm) ansBm++;
    else if (isAns) ans++;
    else if (isBm) notAnsBm++;
  }
  var notAns = total - ans - ansBm - notAnsBm;
  document.getElementById('ansCountS').textContent = ans;
  document.getElementById('ansBmCountS').textContent = ansBm;
  document.getElementById('notAnsBmCountS').textContent = notAnsBm;
  document.getElementById('notAnsCountS').textContent = notAns;
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

  // Bookmark checkbox sync
  document.getElementById('bookmarkCb').checked = review[idx] || false;

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
  updateSummary();
  document.getElementById('clearBtn').disabled = (answers[idx] === null);
  document.getElementById('prevBtn').disabled = (idx === 0);
  document.getElementById('nextBtn').disabled = (idx === 99);
  // Done button only on last question
  document.getElementById('doneBtn').style.display = (idx === 99) ? '' : 'none';
  window.scrollTo(0, 0);
  saveExamState();
}

function selectOption(idx, letter) {
  answers[idx] = letter;
  var opts = document.querySelectorAll('.q-option');
  for (var i = 0; i < opts.length; i++) {
    var isSel = opts[i].getAttribute('data-letter') === letter;
    opts[i].className = 'q-option' + (isSel ? ' selected' : '');
    opts[i].querySelector('.opt-text').className = 'opt-text' + (isSel ? ' selected' : '');
  }
  updatePalette();
  updateSummary();
  document.getElementById('clearBtn').disabled = false;
  saveExamState();
}

function clearResponse() {
  answers[currentIdx] = null;
  var opts = document.querySelectorAll('.q-option');
  for (var i = 0; i < opts.length; i++) {
    opts[i].className = 'q-option';
    opts[i].querySelector('.opt-text').className = 'opt-text';
  }
  updatePalette();
  updateSummary();
  document.getElementById('clearBtn').disabled = true;
  saveExamState();
}

// ============================================================
// NEW UI: BOOKMARK, SIDEBAR TOGGLE, CALCULATOR, INFO
// ============================================================

function toggleBookmark() {
  var cb = document.getElementById('bookmarkCb');
  review[currentIdx] = cb.checked;
  updatePalette();
  updateSummary();
  saveExamState();
}

function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('sidebarToggle');
  sidebar.classList.toggle('collapsed');
  toggle.textContent = sidebar.classList.contains('collapsed') ? '>>' : '<<';
}

function openCalculator() {
  var el = document.getElementById('calcPopup');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function closeCalculator() {
  document.getElementById('calcPopup').style.display = 'none';
}

function calcInput(val) {
  var d = document.getElementById('calcDisplay');
  d.value += val;
}

function calcClear() {
  document.getElementById('calcDisplay').value = '';
}

function calcEquals() {
  var d = document.getElementById('calcDisplay');
  try {
    var expr = d.value;
    // Replace math function names with Math.* equivalents
    expr = expr.replace(/sin\(/g, 'Math.sin(');
    expr = expr.replace(/cos\(/g, 'Math.cos(');
    expr = expr.replace(/tan\(/g, 'Math.tan(');
    expr = expr.replace(/log\(/g, 'Math.log(');
    expr = expr.replace(/exp\(/g, 'Math.exp(');
    // Replace pi symbol with actual value
    expr = expr.replace(/\u03C0/g, '(Math.PI)');
    var result = new Function('return ' + expr)();
    d.value = result;
  } catch(e) {
    d.value = 'Error';
  }
}

function openInstructions() {
  var body = document.getElementById('infoPopupBody');
  // Populate from candidate instructions text
  body.innerHTML =
    '<p><b>About Question Paper:</b></p>' +
    '<ul>' +
    '<li>Only one question will be displayed on the computer screen at a time.</li>' +
    '<li>Each Question will have 4 Answer options. One of the four options is correct answer.</li>' +
    '<li>There will be 1 mark for each correctly answered question.</li>' +
    '<li>There is NO negative marking for wrong answer.</li>' +
    '<li>The questions will be displayed in English language only.</li>' +
    '<li>Candidates can attempt questions in any sequence by clicking on the question number in the Summary Report on the left-hand side of the page.</li>' +
    '<li>During examination, screen will continuously display the remaining time at its top right hand corner.</li>' +
    '</ul>' +
    '<p><b>About Answering Questions:</b></p>' +
    '<ul>' +
    '<li>Click on the option you think is appropriate/correct.</li>' +
    '<li>You can bookmark questions by checking "Bookmark this question" to review before submitting.</li>' +
    '<li>You can navigate between questions either by clicking Previous, Next, or by clicking on question numbers on the left.</li>' +
    '</ul>' +
    '<p><b>About Preview and Submission:</b></p>' +
    '<ul>' +
    '<li>The answers are automatically saved when you select an option.</li>' +
    '<li>"Done" button appears on the last question. Click it to submit the test.</li>' +
    '</ul>';
  document.getElementById('infoOverlay').style.display = 'flex';
}

function closeInstructions(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('infoOverlay').style.display = 'none';
}

// ============================================================
// ASSIGNMENT PRACTICE MODE
// ============================================================

var practiceQuestions, practiceAnswers, practiceReview, practiceCurrentIdx, practiceAssignNum;

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
  clearPracticeState();

  practiceAssignNum = assignNum;
  practiceQuestions = ALL_QUESTIONS.filter(function(q) { return q.assignment === assignNum; });
  resolveVariants(practiceQuestions);
  shuffle(practiceQuestions);
  practiceAnswers = new Array(practiceQuestions.length).fill(null);
  practiceReview = new Array(practiceQuestions.length).fill(false);
  practiceCurrentIdx = 0;

  // Reset practice sidebar to visible
  document.getElementById('pSidebar').classList.remove('collapsed');
  document.getElementById('pSidebarToggle').textContent = '<<';

  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('practiceLayout').classList.remove('hidden');
  document.getElementById('practiceResultScreen').style.display = 'none';

  buildPPalette();
  showPracticeQuestion(0);
}

function buildPPalette() {
  var total = practiceQuestions.length;
  var html = '';
  for (var i = 0; i < total; i++) {
    html += '<div class="q-num not-answered" id="ppn' + i + '" onclick="goToPQuestion(' + i + ')">' + (i + 1) + '</div>';
  }
  document.getElementById('pPalette').innerHTML = html;
  // Update total count for summary
  document.getElementById('pTotalCount').textContent = total;
}

function updatePPalette() {
  var total = practiceQuestions.length;
  for (var i = 0; i < total; i++) {
    var el = document.getElementById('ppn' + i);
    if (!el) continue;
    var isAns = practiceAnswers[i] !== null;
    var isBm = practiceReview && practiceReview[i];
    var isCur = i === practiceCurrentIdx;
    el.className = 'q-num';
    if (isCur) el.classList.add('current');
    if (isAns && isBm) el.classList.add('ans-bookmarked');
    else if (isAns) el.classList.add('answered');
    else if (isBm) el.classList.add('not-ans-bookmarked');
    else el.classList.add('not-answered');
  }
}

function updatePSummary() {
  var total = practiceQuestions.length;
  var ans = 0, ansBm = 0, notAnsBm = 0;
  for (var i = 0; i < total; i++) {
    var isAns = practiceAnswers[i] !== null;
    var isBm = practiceReview && practiceReview[i];
    if (isAns && isBm) ansBm++;
    else if (isAns) ans++;
    else if (isBm) notAnsBm++;
  }
  var notAns = total - ans - ansBm - notAnsBm;
  document.getElementById('pAnsweredCount').textContent = ans;
  document.getElementById('pAnsBmCount').textContent = ansBm;
  document.getElementById('pNotAnsBmCount').textContent = notAnsBm;
  document.getElementById('pNotAnsCount').textContent = notAns;
}

function goToPQuestion(idx) {
  showPracticeQuestion(idx);
}

function togglePBookmark() {
  var cb = document.getElementById('pBookmarkCb');
  practiceReview[practiceCurrentIdx] = cb.checked;
  updatePPalette();
  updatePSummary();
  savePracticeState();
}

function togglePSidebar() {
  var sidebar = document.getElementById('pSidebar');
  var toggle = document.getElementById('pSidebarToggle');
  sidebar.classList.toggle('collapsed');
  toggle.textContent = sidebar.classList.contains('collapsed') ? '>>' : '<<';
}

function clearPracticeResponse() {
  if (practiceAnswers[practiceCurrentIdx] !== null) {
    practiceAnswers[practiceCurrentIdx] = null;
    // Re-render the question without answer, without feedback
    document.getElementById('feedbackBox').classList.add('hidden');
    var q = practiceQuestions[practiceCurrentIdx];
    var opts = document.querySelectorAll('#pQOptions .q-option');
    for (var i = 0; i < opts.length; i++) {
      opts[i].style.pointerEvents = 'auto';
      opts[i].style.cursor = 'pointer';
      opts[i].className = 'q-option';
      opts[i].querySelector('.opt-letter').className = 'opt-letter';
      opts[i].querySelector('.opt-text').className = 'opt-text';
    }
    updatePPalette();
    updatePSummary();
    savePracticeState();
  }
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

  // Bookmark checkbox sync
  document.getElementById('pBookmarkCb').checked = practiceReview ? practiceReview[idx] || false : false;

  var html = '';
  for (var i = 0; i < q.options.length; i++) {
    var opt = q.options[i];
    var letter = opt.letter.toUpperCase();
    html += '<div class="q-option" data-letter="' + opt.letter + '">' +
      '<span class="opt-letter">' + letter + '</span>' +
      '<span class="opt-text">' + esc(opt.text) + '</span></div>';
  }
  document.getElementById('pQOptions').innerHTML = html;

  document.getElementById('pPrevBtn').disabled = (idx === 0);
  document.getElementById('pNextBtn').disabled = (idx === total - 1);

  if (practiceAnswers[idx] !== null) {
    renderPracticeFeedback(idx, q);
  } else {
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

  updatePPalette();
  updatePSummary();
  document.getElementById('pDoneBtn').style.display = (idx === total - 1) ? '' : 'none';
  window.scrollTo(0, 0);
  savePracticeState();
}

function selectPracticeOption(idx, letter) {
  if (practiceAnswers[idx] !== null) return;

  var q = practiceQuestions[idx];
  practiceAnswers[idx] = letter;
  renderPracticeFeedback(idx, q);
  updatePPalette();
  updatePSummary();
  savePracticeState();
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
  clearPracticeState();

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
  if (confirm('Exit practice? Your progress is saved. You can resume later from the main menu.')) {
    savePracticeState();
    document.getElementById('practiceLayout').classList.add('hidden');
    document.getElementById('startScreen').style.display = 'block';
    loadRecords();
  }
}

function retryPractice() {
  clearPracticeState();
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

// ============================================================
// EXAM HISTORY DELETE
// ============================================================

function deleteExamHistory(historyIdx) {
  var raw = getData('bcbr_exam_history');
  if (!raw) return;
  var exams = [];
  try { exams = JSON.parse(raw); } catch(e) {}
  if (historyIdx < 0 || historyIdx >= exams.length) return;

  var ex = exams[historyIdx];
  if (!confirm('Delete exam from ' + new Date(ex.date).toLocaleDateString() + ' (' + ex.score + '%)?')) return;

  exams.splice(historyIdx, 1);
  if (exams.length > 0) {
    setData('bcbr_exam_history', JSON.stringify(exams));
  } else {
    removeData('bcbr_exam_history');
  }

  loadRecords();
}

// ============================================================
// EXAM HISTORY VIEW (re-view past exam results)
// ============================================================

function viewExamHistory(historyIdx) {
  var raw = getData('bcbr_exam_history');
  if (!raw) return;
  var exams = [];
  try { exams = JSON.parse(raw); } catch(e) {}
  if (historyIdx < 0 || historyIdx >= exams.length) return;
  var record = exams[historyIdx];

  // Override the submitted flag so UI treats this as a completed exam
  submitted = true;

  // Hide other screens
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizLayout').classList.add('hidden');
  document.getElementById('assignmentPickerScreen').style.display = 'none';
  document.getElementById('resultScreen').style.display = 'block';
  document.getElementById('practiceLayout').classList.add('hidden');
  document.getElementById('practiceResultScreen').style.display = 'none';

  // Populate score display
  var pct = record.score;
  var passed = pct >= 50;
  var se = document.getElementById('scoreDisplay');
  se.textContent = pct + '%';
  se.className = 'score ' + (passed ? 'pass' : 'fail');
  document.getElementById('scoreLabel').textContent = passed ? 'PASSED! Minimum 50% required.' : 'Below 50% - Keep practicing.';
  document.getElementById('correctCount').textContent = record.correct;
  document.getElementById('wrongCount').textContent = record.wrong;
  document.getElementById('answeredCount').textContent = record.correct + record.wrong;

  // Show date at top of result
  var d = new Date(record.date);
  var dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  var resultHeader = document.querySelector('#resultScreen .result-header');
  if (resultHeader) {
    var existingDate = resultHeader.querySelector('.history-date');
    if (!existingDate) {
      var dateEl = document.createElement('div');
      dateEl.className = 'history-date';
      dateEl.textContent = dateStr;
      resultHeader.insertBefore(dateEl, resultHeader.firstChild);
    } else {
      existingDate.textContent = dateStr;
    }
  }

  // Render wrong cards
  var wl = document.getElementById('wrongList');
  if (!record.wrongDetails || record.wrongDetails.length === 0) {
    wl.innerHTML = '<p style="color:#2e7d32;font-size:16px;text-align:center;">Perfect score! All answers correct.</p>';
  } else {
    // Deduplicate wrongDetails if this exam was stored with duplicate entries
    var seen = {};
    var details = record.wrongDetails.filter(function(d) {
      var key = d.idx + '-' + d.q.stem;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
    var h = '';
    for (var w = 0; w < details.length; w++) {
      var d = details[w];
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
  var timerSaveCounter = 0;
  timerInterval = setInterval(function() {
    timeLeft--;
    timerSaveCounter++;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz(true);
      return;
    }
    // Save timeLeft every 5 seconds so closing the browser preserves remaining time
    if (timerSaveCounter % 5 === 0) {
      setData(STATE_EXAM_KEY, JSON.stringify({
        questions: questions,
        answers: answers,
        review: review,
        currentIdx: currentIdx,
        timeLeft: timeLeft
      }));
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
  s = s.replace(/^(true|false)\b/i, '');
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

function submitQuiz(skipConfirm) {
  if (submitted) return;
  if (!skipConfirm) {
    var unatt = 0;
    for (var i = 0; i < 100; i++) { if (answers[i] === null) unatt++; }
    var msg = 'Are you sure you want to submit?';
    if (unatt > 0) msg += '\n' + unatt + ' question(s) not answered.';
    if (review && review.some(function(v) { return v; })) msg += '\n' + review.filter(function(v) { return v; }).length + ' question(s) marked for review.';
    if (!confirm(msg)) return;
  }

  submitted = true;
  clearExamState();
  clearInterval(timerInterval);
  document.getElementById('quizLayout').classList.add('hidden');
  document.getElementById('resultScreen').style.display = 'block';

  // Clean up any history-view artifacts
  var oldDate = document.querySelector('#resultScreen .result-header .history-date');
  if (oldDate) oldDate.remove();

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

    saveExamHistory(pct, correct, wrong, wrongDetails);

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