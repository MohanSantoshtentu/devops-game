const WORLDS = [
  {
    id: "github",
    name: "GitHub Valley",
    icon: "🐙",
    blurb: "Repos, branches, PRs, and Actions — the source of truth.",
    color: "#f0f6fc",
    lessons: [
      {
        title: "What GitHub actually is",
        body: "<strong>Git</strong> is the version control system. <strong>GitHub</strong> is the collaboration platform built on top of it: remote repositories, pull requests, issues, reviews, and CI via GitHub Actions. A repo holds your code plus history. The default branch is usually <strong>main</strong>.",
        chips: ["git clone", "origin", "main", "remote"]
      },
      {
        title: "Branch → commit → pull request",
        body: "Never push experimental work straight to production main. Create a <strong>feature branch</strong>, make small commits, push the branch, then open a <strong>pull request (PR)</strong>. Reviewers comment, CI runs, then you <strong>merge</strong>. That review gate is how teams avoid breaking prod.",
        chips: ["git checkout -b", "git commit", "git push", "PR review"]
      },
      {
        title: "GitHub Actions in one sentence",
        body: "A <strong>workflow</strong> is a YAML file under <code>.github/workflows/</code>. Events like <em>push</em> or <em>pull_request</em> start <strong>jobs</strong> on runners. Jobs run <strong>steps</strong>: checkout code, install tools, test, build, deploy. Actions are reusable steps from the marketplace or your own org.",
        chips: ["workflow", "job", "runner", "YAML"]
      }
    ],
    quiz: [
      { q: "What is the usual default branch name on modern GitHub repos?", a: ["master-prod", "main", "release", "origin"], c: 1, why: "GitHub switched the default from master to main." },
      { q: "A pull request is primarily for…", a: ["Deleting history", "Reviewing and merging a branch safely", "Restarting a failed EC2 instance", "Building a Docker daemon"], c: 1, why: "PRs are the collaboration + review + CI gate before merge." },
      { q: "Where do GitHub Actions workflow files live?", a: [".actions/", ".github/workflows/", "Jenkinsfile/", "/etc/actions"], c: 1, why: "Convention is .github/workflows/*.yml." }
    ]
  },
  {
    id: "ec2",
    name: "EC2 Island",
    icon: "☁️",
    blurb: "Virtual servers in AWS. Pick an AMI, size, and security group.",
    color: "#ff9900",
    lessons: [
      {
        title: "EC2 is a rented computer",
        body: "<strong>Amazon EC2</strong> (Elastic Compute Cloud) gives you virtual machines called <strong>instances</strong>. You choose an <strong>AMI</strong> (the disk image / OS), an <strong>instance type</strong> (CPU/RAM), storage (EBS), and a <strong>security group</strong> (virtual firewall). You pay while it runs.",
        chips: ["AMI", "instance type", "EBS", "security group"]
      },
      {
        title: "SSH, key pairs, and public IPs",
        body: "Linux instances are usually reached with <strong>SSH</strong> using a <strong>key pair</strong>. The public key lives on the instance; you keep the private .pem file safe. A <strong>public IP / Elastic IP</strong> makes it reachable from the internet — only if the security group allows port 22 (or 443 for apps).",
        chips: ["ssh -i key.pem", "Elastic IP", "port 22", "least privilege"]
      },
      {
        title: "Scale without heroics",
        body: "One instance is a pet. Production prefers a <strong>fleet</strong>: an Auto Scaling Group behind a load balancer. If an instance dies, ASG launches another from the same launch template. That’s the “Elastic” in EC2.",
        chips: ["ASG", "ALB/NLB", "launch template", "health check"]
      }
    ],
    quiz: [
      { q: "What does AMI stand for?", a: ["Amazon Machine Image", "Auto Memory Index", "AWS Managed Instance", "Application Mesh Interface"], c: 0, why: "An AMI is the template disk image used to launch instances." },
      { q: "A security group is best described as a…", a: ["Billing alarm", "Virtual firewall for the instance", "Git branch rule", "Kubernetes controller"], c: 1, why: "Security groups allow/deny traffic by port, protocol, and source." },
      { q: "Why use an Auto Scaling Group?", a: ["To edit YAML faster", "To replace unhealthy instances and scale with load", "To store Docker layers", "To name Git tags"], c: 1, why: "ASGs keep the desired count healthy and can scale on metrics." }
    ]
  },
  {
    id: "docker",
    name: "Docker Docks",
    icon: "🐳",
    blurb: "Package the app + runtime so it runs the same everywhere.",
    color: "#2496ed",
    lessons: [
      {
        title: "Image vs container",
        body: "A <strong>Docker image</strong> is an immutable snapshot (layers of filesystem + metadata). A <strong>container</strong> is a running instance of that image, isolated with namespaces and cgroups. Build once, run many. That's why “works on my machine” dies.",
        chips: ["image", "container", "layer", "registry"]
      },
      {
        title: "Dockerfile is the recipe",
        body: "FROM a base image, COPY your app, RUN installs, EXPOSE a port, CMD or ENTRYPOINT to start. Keep images small: use slim bases, multi-stage builds, and don’t copy secrets. Tag images clearly: <code>myapp:1.4.2</code> beats <code>latest</code> in production.",
        chips: ["FROM", "COPY", "RUN", "multi-stage"]
      },
      {
        title: "Registry and compose",
        body: "Push images to a <strong>registry</strong> (Docker Hub, GHCR, ECR). Other machines pull them. <strong>Docker Compose</strong> describes multi-container apps on one host (app + database + cache) with a YAML file — great for local DevOps practice before Kubernetes.",
        chips: ["docker push", "GHCR/ECR", "compose.yml", "port mapping"]
      }
    ],
    quiz: [
      { q: "An image is to a container as…", a: ["A class is to an object", "A PR is to a merge conflict", "A VPC is to a subnet only", "A pod is to etcd"], c: 0, why: "The image is the template; the container is a running instance." },
      { q: "Which instruction sets the default process when a container starts?", a: ["LABEL", "VOLUME", "CMD / ENTRYPOINT", "HEALTHCHECK only"], c: 2, why: "CMD or ENTRYPOINT define what runs inside the container." },
      { q: "Why avoid :latest in production deploys?", a: ["It is illegal", "It is not a real tag", "It is mutable and makes rollbacks / audits unclear", "Docker forbids it"], c: 2, why: "Pinned versions are reproducible. latest can silently change." }
    ]
  },
  {
    id: "jenkins",
    name: "Jenkins Junction",
    icon: "👷",
    blurb: "Classic CI/CD server: pipelines that build, test, and deploy.",
    color: "#d33833",
    lessons: [
      {
        title: "What Jenkins is for",
        body: "<strong>Jenkins</strong> is an automation server. A <strong>job</strong> or <strong>pipeline</strong> watches your repo (often GitHub via webhook), then builds, tests, and deploys. Plugins extend it for Docker, Kubernetes, Slack, AWS, and more. Think: the factory line for your code.",
        chips: ["job", "webhook", "plugin", "agent"]
      },
      {
        title: "Jenkinsfile = pipeline as code",
        body: "Modern Jenkins uses a <strong>Jenkinsfile</strong> in the repo. Declarative pipelines have <code>pipeline { agent any; stages { stage('Test') { steps { ... } } } }</code>. Stages are visible in Blue Ocean / the classic UI. Failed stages stop the line unless you mark them optional.",
        chips: ["Jenkinsfile", "stage", "steps", "agent"]
      },
      {
        title: "Controllers, agents, credentials",
        body: "The <strong>controller</strong> orchestrates. <strong>Agents</strong> (nodes) do the heavy build work — often Docker agents so each build is clean. Secrets belong in <strong>Jenkins Credentials</strong>, not hardcoded in the Jenkinsfile. Trigger builds from GitHub webhooks so every PR gets tested.",
        chips: ["controller", "agent", "credentials", "webhook"]
      }
    ],
    quiz: [
      { q: "A Jenkinsfile is valuable because it is…", a: ["Hidden from Git", "Pipeline-as-code stored with the app", "An AMI", "A Kubernetes Service"], c: 1, why: "Versioned pipelines review like any other code." },
      { q: "Where should production API keys live in Jenkins?", a: ["Pasted into the Jenkinsfile", "In Jenkins Credentials (or a vault plugin)", "In the Dockerfile as ENV", "In a public gist"], c: 1, why: "Credentials stores secrets separately from pipeline text." },
      { q: "What typically starts a Jenkins build on a new GitHub commit?", a: ["A security group", "A webhook (or poll SCM)", "An etcd watch only", "SSH into EC2 by hand"], c: 1, why: "GitHub notifies Jenkins via webhook; polling is the older fallback." }
    ]
  },
  {
    id: "k8s",
    name: "Kubernetes Peak",
    icon: "☸️",
    blurb: "Orchestrate containers: desired state, pods, services, rollouts.",
    color: "#326ce5",
    lessons: [
      {
        title: "Desired state, not babysitting",
        body: "<strong>Kubernetes</strong> runs containers across a cluster of machines. You declare what you want: “3 replicas of my API, healthy, behind a Service.” Controllers keep reality matching that <strong>desired state</strong>. If a node dies, pods are rescheduled.",
        chips: ["cluster", "control plane", "desired state", "kubelet"]
      },
      {
        title: "Pod, Deployment, Service",
        body: "A <strong>Pod</strong> is the smallest unit — one or more containers sharing network/storage. You rarely create naked pods in prod. A <strong>Deployment</strong> manages replica Pods and rolling updates. A <strong>Service</strong> gives a stable virtual IP / DNS name in front of changing pods.",
        chips: ["Pod", "Deployment", "Service", "label selector"]
      },
      {
        title: "YAML, kubectl, and shipping",
        body: "You apply manifests with <code>kubectl apply -f app.yaml</code>. Images come from a registry (often built by Jenkins or GitHub Actions). ConfigMaps and Secrets inject config. Ingress or a cloud load balancer exposes HTTP. Watch rollouts: <code>kubectl rollout status deploy/api</code>.",
        chips: ["kubectl apply", "ConfigMap", "Secret", "Ingress"]
      }
    ],
    quiz: [
      { q: "The smallest deployable unit in Kubernetes is a…", a: ["Container only", "Pod", "AMI", "Jenkins stage"], c: 1, why: "Pods wrap one or more containers and are scheduled as a unit." },
      { q: "A Service exists so that…", a: ["Pods get a stable network identity as they come and go", "Git history is rewritten", "EC2 AMIs stay patched", "Dockerfiles compile faster"], c: 0, why: "Pods are ephemeral; Services select them by labels." },
      { q: "What does a Deployment add over a lone Pod?", a: ["Nothing", "Replica count, rolling updates, and self-healing", "A billing account", "An SSH key pair"], c: 1, why: "Deployments are the usual controller for stateless apps." }
    ]
  }
];
