const POP_QUIZ = [
  { q: "CI usually means…", a: ["Container Isolation", "Continuous Integration", "Cloud Instance", "Cluster Ingress"], c: 1, why: "CI is automatically building/testing every change." },
  { q: "CD in DevOps most often means…", a: ["Compact Disk", "Continuous Delivery / Deployment", "Control Daemon", "Container Driver"], c: 1, why: "CD automates release to staging or production." },
  { q: "Infrastructure as Code means…", a: ["Clicking the AWS console from memory", "Declaring infra in versioned files (Terraform, CloudFormation…)", "Emailing the intern the root password", "Only using Kubernetes"], c: 1, why: "IaC makes infra reviewable and repeatable." },
  { q: "Which pair is image vs running process?", a: ["EC2 AMI vs instance, Docker image vs container", "PR vs issue", "Service vs Ingress only", "Jenkins vs Maven"], c: 0, why: "Both AMI→instance and image→container are template→runtime." },
  { q: "etcd in Kubernetes stores…", a: ["Your laptop wallpaper", "Cluster state / desired config", "Docker Hub passwords only", "Git LFS objects"], c: 1, why: "The control plane keeps cluster state in etcd." },
  { q: "Least privilege for an EC2 security group means…", a: ["Open 0.0.0.0/0 on all ports", "Only the ports and sources the app needs", "Disable SSH forever with no alternative", "Share the .pem in Slack"], c: 1, why: "Expose only required traffic." },
  { q: "A GitHub Action runner is…", a: ["A machine (GitHub-hosted or self-hosted) that executes workflow jobs", "A Kubernetes Ingress", "An EC2 AMI publisher", "A Docker HEALTHCHECK"], c: 0, why: "Jobs need a computer to run on — that's the runner." },
  { q: "Blue/green or rolling deploys exist to…", a: ["Look colorful in dashboards", "Release with less downtime and easier rollback", "Avoid writing tests", "Replace Git"], c: 1, why: "You shift traffic gradually or flip after the new version is healthy." }
];

const state = {
  xp: 0,
  lives: 3,
  streak: 0,
  badges: {},
  completed: {},
  screen: "home",
  worldIndex: 0,
  lessonIndex: 0,
  quizIndex: 0,
  phase: "lesson"
};

const el = (id) => document.getElementById(id);

function save() {
  localStorage.setItem("devops-quest", JSON.stringify({
    xp: state.xp, lives: state.lives, streak: state.streak,
    badges: state.badges, completed: state.completed
  }));
}

function load() {
  try {
    const raw = localStorage.getItem("devops-quest");
    if (!raw) return;
    const s = JSON.parse(raw);
    Object.assign(state, s);
    if (state.lives < 1) state.lives = 3;
  } catch (_) {}
}

function hud() {
  el("xp").textContent = state.xp;
  el("lives").textContent = "♥".repeat(Math.max(state.lives, 0)) || "0";
  el("badges").textContent = Object.keys(state.badges).length;
  el("streak").textContent = state.streak;
}

function showModal(html) {
  el("modalCard").innerHTML = html;
  el("modal").classList.remove("hidden");
}

function hideModal() {
  el("modal").classList.add("hidden");
}

function maybePopQuiz() {
  if (Math.random() > 0.38) return;
  const item = POP_QUIZ[Math.floor(Math.random() * POP_QUIZ.length)];
  renderPop(item);
}

function renderPop(item) {
  showModal(`
    <div class="pop-tag">⚡ Pop quiz</div>
    <h2 style="font-size:22px;margin-bottom:8px;">Ambush from production</h2>
    <p class="lead">${item.q}</p>
    <div class="choices" id="popChoices"></div>
    <p class="feedback" id="popFb"></p>
  `);
  const box = document.getElementById("popChoices");
  item.a.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = text;
    b.onclick = () => {
      const ok = i === item.c;
      grade(ok, item.why);
      b.classList.add(ok ? "correct" : "wrong");
      document.getElementById("popFb").className = "feedback " + (ok ? "ok" : "bad");
      document.getElementById("popFb").textContent = (ok ? "Nice. " : "Ouch. ") + item.why;
      [...box.children].forEach((c) => (c.disabled = true));
      setTimeout(() => hideModal(), 1600);
    };
    box.appendChild(b);
  });
}

function grade(ok, _why) {
  if (ok) {
    state.xp += 15 + state.streak * 2;
    state.streak += 1;
  } else {
    state.lives -= 1;
    state.streak = 0;
    state.xp = Math.max(0, state.xp - 5);
    if (state.lives <= 0) {
      hideModal();
      gameOver();
      return;
    }
  }
  hud();
  save();
}

function gameOver() {
  state.screen = "dead";
  el("screen").innerHTML = `
    <div class="card win">
      <div class="kicker">Incident declared</div>
      <h2>Prod is on fire. You are out of lives.</h2>
      <p>XP kept: ${state.xp}. Badges kept. Grab three lives and jump back in — blameless retro, then ship again.</p>
      <button id="revive">Restart with 3 lives</button>
    </div>`;
  document.getElementById("revive").onclick = () => {
    state.lives = 3;
    state.streak = 0;
    state.screen = "home";
    save();
    renderHome();
  };
}

function renderHome() {
  hud();
  const earned = Object.keys(state.badges).length;
  const allDone = earned >= WORLDS.length;
  el("screen").innerHTML = `
    <div class="card">
      <div class="hero">
        <div>
          <div class="kicker">Training simulation</div>
          <h2>${allDone ? "Ranger status unlocked." : "Learn the toolchain by playing through five worlds."}</h2>
          <p class="lead">GitHub → EC2 → Docker → Jenkins → Kubernetes. Each world has a short lesson path and a boss quiz. Random pop quizzes can appear after a lesson. Miss too many and you page yourself.</p>
          <div class="btn-row">
            <button id="play">${allDone ? "Replay a world" : "Start / continue"}</button>
            <button class="ghost" id="reset">Reset progress</button>
          </div>
          <div class="badge-row">
            ${WORLDS.map((w) => `<div class="badge ${state.badges[w.id] ? "earned" : ""}">${w.icon} ${w.name.split(" ")[0]} ${state.badges[w.id] ? "✓" : ""}</div>`).join("")}
          </div>
        </div>
        <div>
          <div class="concept">
            <strong>How to win.</strong> Finish all five world quizzes. You become a DevOps Ranger. Lives refill only after a wipe or a reset. Streaks boost XP.
          </div>
        </div>
      </div>
      <div class="worlds" id="worlds"></div>
    </div>`;

  const wrap = document.getElementById("worlds");
  WORLDS.forEach((w, idx) => {
    const prevDone = idx === 0 || state.badges[WORLDS[idx - 1].id];
    const locked = !prevDone;
    const div = document.createElement("div");
    div.className = "world" + (locked ? " locked" : "");
    div.innerHTML = `
      <div class="icon">${w.icon}</div>
      <h3>${w.name}</h3>
      <p>${w.blurb}</p>
      <div class="meta">${locked ? "Locked — clear the previous world" : state.badges[w.id] ? "Badge earned — replay" : "Ready"}</div>`;
    if (!locked) {
      div.onclick = () => startWorld(idx);
    }
    wrap.appendChild(div);
  });

  document.getElementById("play").onclick = () => {
    const next = WORLDS.findIndex((w) => !state.badges[w.id]);
    startWorld(next === -1 ? 0 : next);
  };
  document.getElementById("reset").onclick = () => {
    localStorage.removeItem("devops-quest");
    Object.assign(state, { xp: 0, lives: 3, streak: 0, badges: {}, completed: {}, screen: "home" });
    renderHome();
  };

  if (allDone) {
    el("screen").insertAdjacentHTML("afterbegin", `
      <div class="card win" style="margin-bottom:16px;">
        <div class="kicker">Promotion</div>
        <h2>DevOps Ranger</h2>
        <p>You connected source control, compute, containers, CI, and orchestration. That is the real pipeline: GitHub hosts the code, Jenkins or Actions build it, Docker packages it, EC2 (or nodes) run it, Kubernetes keeps it alive.</p>
      </div>`);
  }
}

function startWorld(idx) {
  state.worldIndex = idx;
  state.lessonIndex = 0;
  state.quizIndex = 0;
  state.phase = "lesson";
  renderWorld();
}

function renderWorld() {
  hud();
  const world = WORLDS[state.worldIndex];
  if (state.phase === "lesson") renderLesson(world);
  else renderQuiz(world);
}

function renderLesson(world) {
  const lesson = world.lessons[state.lessonIndex];
  const total = world.lessons.length;
  const pct = Math.round(((state.lessonIndex) / (total + world.quiz.length)) * 100);

  el("screen").innerHTML = `
    <div class="lesson">
      <aside class="sidebar">
        <h3>${world.icon} ${world.name}</h3>
        ${world.lessons.map((l, i) => `<div class="step ${i < state.lessonIndex ? "done" : i === state.lessonIndex ? "active" : ""}">${i < state.lessonIndex ? "✓ " : ""}${l.title}</div>`).join("")}
        <div class="step">Boss quiz</div>
        <button class="ghost" id="backHome" style="margin-top:12px;width:100%;">← Worlds</button>
      </aside>
      <div class="card content">
        <div class="kicker">Lesson ${state.lessonIndex + 1} / ${total}</div>
        <h2>${lesson.title}</h2>
        <div class="progress-wrap"><div class="bar"><i style="width:${pct}%"></i></div></div>
        <div class="concept">${lesson.body}</div>
        <div class="chips">${lesson.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
        <div class="btn-row">
          <button id="nextLesson">${state.lessonIndex === total - 1 ? "Enter boss quiz" : "Got it — next"}</button>
        </div>
      </div>
    </div>`;

  document.getElementById("backHome").onclick = renderHome;
  document.getElementById("nextLesson").onclick = () => {
    if (state.lessonIndex < total - 1) {
      state.lessonIndex += 1;
      state.xp += 8;
      hud();
      save();
      maybePopQuiz();
      renderWorld();
    } else {
      state.xp += 8;
      state.phase = "quiz";
      state.quizIndex = 0;
      hud();
      save();
      maybePopQuiz();
      renderWorld();
    }
  };
}

function renderQuiz(world) {
  const item = world.quiz[state.quizIndex];
  const n = state.quizIndex + 1;
  const total = world.quiz.length;

  el("screen").innerHTML = `
    <div class="lesson">
      <aside class="sidebar">
        <h3>${world.icon} ${world.name}</h3>
        ${world.lessons.map((l) => `<div class="step done">✓ ${l.title}</div>`).join("")}
        <div class="step active">Boss quiz ${n}/${total}</div>
        <button class="ghost" id="backHome" style="margin-top:12px;width:100%;">← Worlds</button>
      </aside>
      <div class="card content quiz-box">
        <div class="kicker">Boss quiz</div>
        <h2>${item.q}</h2>
        <div class="choices" id="choices"></div>
        <p class="feedback" id="fb"></p>
        <button id="cont" disabled>Continue</button>
      </div>
    </div>`;

  document.getElementById("backHome").onclick = renderHome;
  const box = document.getElementById("choices");
  const fb = document.getElementById("fb");
  const cont = document.getElementById("cont");
  let answered = false;

  item.a.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = text;
    b.onclick = () => {
      if (answered) return;
      answered = true;
      const ok = i === item.c;
      grade(ok, item.why);
      if (state.lives <= 0) return;
      b.classList.add(ok ? "correct" : "wrong");
      box.children[item.c].classList.add("correct");
      fb.className = "feedback " + (ok ? "ok" : "bad");
      fb.textContent = (ok ? "Correct. " : "Not quite. ") + item.why;
      cont.disabled = false;
    };
    box.appendChild(b);
  });

  cont.onclick = () => {
    if (state.quizIndex < total - 1) {
      state.quizIndex += 1;
      renderWorld();
    } else {
      state.badges[world.id] = true;
      state.xp += 40;
      hud();
      save();
      showModal(`
        <div class="kicker">Badge unlocked</div>
        <h2 style="margin:8px 0 10px;">${world.icon} ${world.name}</h2>
        <p class="lead">You cleared the boss quiz. ${Object.keys(state.badges).length}/5 badges.</p>
        <button id="okBadge">Back to the map</button>
      `);
      document.getElementById("okBadge").onclick = () => {
        hideModal();
        renderHome();
      };
    }
  };
}

load();
hud();
renderHome();
