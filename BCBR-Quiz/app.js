function isMobile() { return window.innerWidth < 768; }

function togglePalette() {
  if (!isMobile()) return;
  document.getElementById('paletteWrap').classList.toggle('collapsed');
  document.getElementById('sidebarTitle').classList.toggle('collapsed');
}

// Collapse palette by default on mobile
(function() {
  if (window.innerWidth < 768) {
    document.getElementById('paletteWrap').classList.add('collapsed');
    document.getElementById('sidebarTitle').classList.add('collapsed');
  }
})();

// Expand palette when resizing to desktop
window.addEventListener('resize', function() {
  if (!isMobile()) {
    document.getElementById('paletteWrap').classList.remove('collapsed');
    document.getElementById('sidebarTitle').classList.remove('collapsed');
  }
});

var ALL_QUESTIONS = window.ALL_QUESTIONS;

function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

var questions, answers, review, currentIdx, timerInterval, timeLeft, submitted;

function startQuiz() {
  var s = shuffle(ALL_QUESTIONS.slice());
  questions = s.slice(0, 100);
  answers = new Array(100).fill(null);
  review = new Array(100).fill(false);
  currentIdx = 0;
  submitted = false;
  timeLeft = 3 * 3600; // 3 hours in seconds

  document.getElementById('startScreen').style.display = 'none';
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
  window.scrollTo(0, 0);
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

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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