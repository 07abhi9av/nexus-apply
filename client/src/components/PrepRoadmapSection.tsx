import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Terminal,
  Code2,
  Server,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoadmapNode {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  tags: string[];
  importance: 'Critical' | 'High Frequency' | 'Core Platform';
  companyAskers: string[];
  summary: string;
  keyTakeaways: string[];
  interviewQuestions: {
    question: string;
    answerHint: string;
  }[];
  codeSnippet?: {
    language: string;
    code: string;
    title: string;
  };
}

const DEVOPS_ROADMAP: RoadmapNode[] = [
  {
    id: 'devops-1-linux',
    stepNumber: 1,
    title: 'Linux Systems & Kernel Diagnostics',
    subtitle: 'Process lifecycle, namespaces, cgroups, /proc internals & troubleshooting',
    tags: ['Linux', 'systemd', 'cgroups', 'strace', 'iptables'],
    importance: 'Critical',
    companyAskers: ['Google', 'Databricks', 'LSEG', 'Amazon'],
    summary:
      'Mastering Linux internals is the cornerstone of SRE and platform engineering. Production incidents require diagnosing memory leaks, zombie processes, socket exhaustion, and kernel resource starvation.',
    keyTakeaways: [
      'Understand how cgroups v2 limits CPU and memory for container runtimes.',
      'Diagnose I/O bottlenecks using iostat, vmstat, and strace.',
      'Inspect TCP socket states (TIME_WAIT, CLOSE_WAIT) via netstat / ss.',
      'Configure systemd unit files with graceful restart limits and watchdog timers.'
    ],
    interviewQuestions: [
      {
        question: 'What happens when a Linux process receives a SIGKILL vs SIGTERM?',
        answerHint:
          'SIGTERM (signal 15) allows the process to catch the signal, clean up file handles, close DB pools, and exit cleanly. SIGKILL (signal 9) is handled directly by the kernel and terminates the process immediately without cleanup.'
      },
      {
        question: 'Explain how cgroups and namespaces differ in container isolation.',
        answerHint:
          'Namespaces isolate what a process can SEE (PID, mount, network, IPC, UTS, user). Cgroups limit and account for what a process can USE (CPU quota, memory limits, I/O bandwidth).'
      },
      {
        question: 'How do you troubleshoot a server with 100% CPU load where top shows 0% user and 99% sys?',
        answerHint:
          'High sys CPU indicates kernel-level contention: excessive syscalls, kernel lock spinning, context switching, or memory page fault swapping. Use `perf top` or `vmstat 1` to identify the offending kernel function.'
      }
    ],
    codeSnippet: {
      language: 'bash',
      title: 'Linux Kernel & Socket Diagnosis Commands',
      code: `# Inspect active listening ports and TCP connection states
ss -tulpn | grep LISTEN
ss -s # Summary of established vs TIME_WAIT sockets

# Profile CPU syscalls for a misbehaving process
strace -c -p <PID>

# Check memory cgroup limits for a container process
cat /sys/fs/cgroup/memory/<container_id>/memory.current`
    }
  },
  {
    id: 'devops-2-networking',
    stepNumber: 2,
    title: 'Networking, DNS & Route 53 GSLB',
    subtitle: 'TCP/IP 3-way handshake, Route 53 health checks, automated multi-region recovery',
    tags: ['Route 53', 'DNS', 'TCP/IP', 'GSLB', 'TLS/SSL'],
    importance: 'Critical',
    companyAskers: ['Stripe', 'LSEG', 'Cloudflare', 'Apple'],
    summary:
      'High-availability financial and cloud platforms rely on Route 53 Global Server Load Balancing (GSLB) to route requests to healthy regional clusters and failover automatically during an AZ outage.',
    keyTakeaways: [
      'Configure Route 53 Latency-based and Failover routing policies.',
      'Implement deep health checks evaluating /healthz endpoints with 10s intervals.',
      'Prevent DNS caching issues during failovers by maintaining 30s-60s TTLs.',
      'Diagnose MTU mismatch and packet fragmentation across VPC peering connections.'
    ],
    interviewQuestions: [
      {
        question: 'How does Route 53 DNS failover work when a primary region goes down?',
        answerHint:
          'Route 53 health checkers probe the primary endpoint. If health check probes fail 3 consecutive times, Route 53 withdraws the primary A/AAAA record and returns the secondary standby record based on the configured failover policy.'
      },
      {
        question: 'Why can a DNS TTL of 300 seconds cause downtime during a regional disaster recovery drill?',
        answerHint:
          'Client resolvers and ISP DNS servers cache responses for up to 300 seconds (5 minutes). Even if Route 53 changes the IP in 5 seconds, clients continue querying the dead IP until their local cache expires.'
      }
    ]
  },
  {
    id: 'devops-3-kubernetes',
    stepNumber: 3,
    title: 'Amazon EKS & Kubernetes Operations',
    subtitle: 'Zero-downtime rolling upgrades, node cordon/drain, HPA, DaemonSets & PVs',
    tags: ['Kubernetes', 'EKS', 'HPA', 'Helm', 'Ingress'],
    importance: 'Critical',
    companyAskers: ['Google', 'Databricks', 'Spotify', 'Uber'],
    summary:
      'Running production Kubernetes at scale requires mastering cluster control-plane upgrades, node pool rotation without packet drops, pod disruption budgets (PDB), and autoscaling.',
    keyTakeaways: [
      'Maintain PodDisruptionBudgets (PDB) ensuring minAvailable replicas during node drains.',
      'Configure readiness and liveness probes properly to avoid cascading pod death.',
      'Set exact requests and limits to guarantee Guaranteed/Burstable QoS classes.',
      'Utilize Karpenter or Cluster Autoscaler for dynamic node scaling based on pending pods.'
    ],
    interviewQuestions: [
      {
        question: 'Explain the sequence of events when running `kubectl drain node-1`.',
        answerHint:
          '1. Node is cordoned (marked unschedulable). 2. Controller sends SIGTERM to pods on that node. 3. Grace period countdown starts. 4. Service endpoints remove terminating pods. 5. Pods exit or receive SIGKILL after terminationGracePeriodSeconds.'
      },
      {
        question: 'What is the difference between a Liveness Probe and a Readiness Probe?',
        answerHint:
          'Liveness probe failure kills and restarts the container. Readiness probe failure keeps the pod alive but removes it from the Service load balancer endpoint pool so it receives no traffic.'
      }
    ],
    codeSnippet: {
      language: 'yaml',
      title: 'Zero-Downtime Deployment & PDB Manifest',
      code: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: platform-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: platform-engine
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: platform-engine
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0`
    }
  },
  {
    id: 'devops-4-terraform',
    stepNumber: 4,
    title: 'Terraform & Infrastructure-as-Code (IaC)',
    subtitle: 'Remote state locking, module authoring, drift detection & least-privilege IAM',
    tags: ['Terraform', 'IaC', 'AWS IAM', 'S3 Backend', 'DynamoDB'],
    importance: 'High Frequency',
    companyAskers: ['Stripe', 'Coinbase', 'Figma', 'Amazon'],
    summary:
      'Manage multi-environment cloud infrastructure reproducibly with state locking, modular abstractions, and policy-as-code guardrails.',
    keyTakeaways: [
      'Store remote state in S3 with DynamoDB table for distributed state locking.',
      'Organize code into reusable modules (VPC, EKS, Security Groups).',
      'Use workspaces or separate directory roots per environment (dev, stage, prod).',
      'Prevent manual configuration drift via automated CI plan validation.'
    ],
    interviewQuestions: [
      {
        question: 'What happens if two engineers run `terraform apply` simultaneously without state locking?',
        answerHint:
          'Race conditions occur where one apply overwrites the other\'s state file in S3, causing corrupt state, phantom resources, or accidental resource deletion. DynamoDB state locking prevents concurrent executions.'
      }
    ]
  },
  {
    id: 'devops-5-cicd',
    stepNumber: 5,
    title: 'CI/CD Pipelines & GitOps Deployment',
    subtitle: 'Jenkins build agents, GitHub Actions, ArgoCD sync & canary releases',
    tags: ['Jenkins', 'ArgoCD', 'GitHub Actions', 'GitOps', 'Canary'],
    importance: 'High Frequency',
    companyAskers: ['GitLab', 'Atlassian', 'Databricks', 'LSEG'],
    summary:
      'Build automated release pipelines that enforce unit testing, SonarQube security gates, container image signing, and automated rollback upon health check failure.',
    keyTakeaways: [
      'Separate CI (Build, Test, Scan, Publish image) from CD (Deploy via GitOps).',
      'Use ArgoCD for declarative continuous deployment with auto-sync and prune.',
      'Implement Canary or Blue/Green deployment to validate 5% traffic before full rollout.'
    ],
    interviewQuestions: [
      {
        question: 'How does GitOps with ArgoCD differ from traditional push-based CI/CD?',
        answerHint:
          'In push CI/CD, the build runner holds cluster credentials and pushes changes. In GitOps, an in-cluster controller (ArgoCD) monitors git and pulls changes, ensuring zero cluster secrets leave the VPC.'
      }
    ]
  },
  {
    id: 'devops-6-observability',
    stepNumber: 6,
    title: 'Observability & Incident Reliability (SRE)',
    subtitle: 'Datadog dashboards, Prometheus PromQL, SLI/SLO error budgets & post-mortems',
    tags: ['Prometheus', 'Datadog', 'Grafana', 'SLO', 'Runbooks'],
    importance: 'Critical',
    companyAskers: ['Google', 'Datadog', 'Amazon', 'Netflix'],
    summary:
      'Production engineering excellence requires actionable alerting, synthetic probes, blameless post-mortem leadership, and reducing MTTD.',
    keyTakeaways: [
      'The 4 Golden Signals: Latency, Traffic, Errors, Saturation.',
      'Define Error Budgets: (100% - 99.9% = 0.1% allowable outage per month).',
      'Use structured JSON logs correlated with trace IDs for microservices debugging.'
    ],
    interviewQuestions: [
      {
        question: 'How do you differentiate between an SLI, SLO, and SLA?',
        answerHint:
          'SLI (Service Level Indicator) is the metric (e.g. 99.92% successful requests). SLO (Service Level Objective) is the internal target (e.g. 99.9%). SLA (Service Level Agreement) is the legal contract with customers with financial penalties.'
      }
    ]
  }
];

const DSA_ROADMAP: RoadmapNode[] = [
  {
    id: 'dsa-1-arrays',
    stepNumber: 1,
    title: 'Arrays, Two Pointers & Sliding Window',
    subtitle: 'Subarray optimization, monotonic boundaries, in-place manipulation & frequency maps',
    tags: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'Hash Table'],
    importance: 'Critical',
    companyAskers: ['Google', 'Meta', 'Amazon', 'Microsoft'],
    summary:
      'Mastering continuous subarray boundaries, two-pointer shrinking/expanding, and hash table lookups is tested in virtually every first-round technical screen.',
    keyTakeaways: [
      'Use Two Pointers for sorted arrays (Pair Sum, 3Sum, Container with Most Water).',
      'Use Variable Sliding Window for substring length constraints.',
      'Use Prefix Sum for O(1) range sum queries.'
    ],
    interviewQuestions: [
      {
        question: 'How do you find the longest substring without repeating characters in O(n)?',
        answerHint:
          'Maintain a sliding window [left, right] and a hash map of character indices. When a duplicate character is seen at index >= left, jump left to last_seen_index + 1.'
      }
    ],
    codeSnippet: {
      language: 'python',
      title: 'Sliding Window - Longest Substring Without Repeats',
      code: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`
    }
  },
  {
    id: 'dsa-2-stacks',
    stepNumber: 2,
    title: 'Stack & Queue Mechanics (LRU Cache)',
    subtitle: 'Monotonic stack, Next Greater Element, Doubly Linked List & O(1) Cache eviction',
    tags: ['Monotonic Stack', 'LRU Cache', 'Queue', 'Deque'],
    importance: 'Critical',
    companyAskers: ['Amazon', 'Uber', 'Databricks', 'Apple'],
    summary:
      'Stacks and queues model real system behaviors such as memory buffers, task schedulers, and cache eviction policies.',
    keyTakeaways: [
      'Monotonic Stack finds the next/previous greater/smaller element in O(n) total time.',
      'Design an LRU Cache in O(1) get and put using a Hash Map + Doubly Linked List.'
    ],
    interviewQuestions: [
      {
        question: 'Why is a Doubly Linked List required alongside a Hash Map for an LRU Cache?',
        answerHint:
          'The Hash Map gives O(1) lookup to nodes, but removing and re-inserting a node at the head/tail requires O(1) pointer updates, which only a Doubly Linked List supports without linear traversal.'
      }
    ]
  },
  {
    id: 'dsa-3-trees',
    stepNumber: 3,
    title: 'Trees, BST & Breadth-First Search',
    subtitle: 'Tree traversals, Lowest Common Ancestor, Level-order BFS & balanced trees',
    tags: ['Binary Tree', 'BST', 'BFS', 'DFS', 'Recursion'],
    importance: 'Critical',
    companyAskers: ['Google', 'Meta', 'Microsoft', 'Bloomberg'],
    summary:
      'Hierarchical data structures represent organizational charts, filesystem directories, and routing tables.',
    keyTakeaways: [
      'BFS with a Queue solves shortest path in unweighted graphs and level-order traversals.',
      'DFS with recursion handles path sum, height calculation, and tree validation.'
    ],
    interviewQuestions: [
      {
        question: 'How do you find the Lowest Common Ancestor (LCA) of two nodes in a Binary Tree?',
        answerHint:
          'Base case: if root is None, p, or q, return root. Recurse left and right. If both return non-null, root is the LCA. If only one returns non-null, propagate that node upward.'
      }
    ]
  },
  {
    id: 'dsa-4-graphs',
    stepNumber: 4,
    title: 'Graphs, Topological Sort & Shortest Path',
    subtitle: 'Dependency resolution, Dijkstra algorithm, cycle detection & union-find',
    tags: ['Graph', 'Dijkstra', 'Topological Sort', 'Union-Find'],
    importance: 'High Frequency',
    companyAskers: ['Uber', 'Google', 'Amazon', 'Stripe'],
    summary:
      'Directly applicable to package managers, Terraform resource DAG execution, and network routing.',
    keyTakeaways: [
      'Use Topological Sort (Kahn\'s algorithm or DFS post-order) to order task dependencies.',
      'Use Dijkstra with Min-Heap for single-source shortest path with non-negative weights.'
    ],
    interviewQuestions: [
      {
        question: 'How does Terraform or Make determine the order to build resources?',
        answerHint:
          'It constructs a Directed Acyclic Graph (DAG) of resource dependencies and runs a Topological Sort. If a cycle is detected, an error is returned because a cyclic dependency cannot be resolved.'
      }
    ]
  },
  {
    id: 'dsa-5-dp',
    stepNumber: 5,
    title: 'Dynamic Programming & State Transitions',
    subtitle: 'Memoization, tabulation, 0/1 Knapsack, Coin Change & Longest Common Subsequence',
    tags: ['Dynamic Programming', 'Memoization', 'Tabulation'],
    importance: 'High Frequency',
    companyAskers: ['Google', 'Amazon', 'Goldman Sachs', 'DE Shaw'],
    summary:
      'Break complex optimization problems into overlapping subproblems with optimal substructure.',
    keyTakeaways: [
      'Identify the state parameters (e.g. index, remaining capacity).',
      'Write the recursive transition formula before optimizing with a memo table.'
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between top-down memoization and bottom-up tabulation?',
        answerHint:
          'Top-down starts from the final state and recurses down, caching computed results. Bottom-up starts from base cases and fills an array iteratively, often allowing space optimization.'
      }
    ]
  },
  {
    id: 'dsa-6-system-dsa',
    stepNumber: 6,
    title: 'System-Level DSA & Rate Limiting',
    subtitle: 'Token bucket, Leaky bucket, sliding log, and Bloom filters for scale',
    tags: ['Rate Limiter', 'Bloom Filter', 'Concurrency', 'System Design'],
    importance: 'Critical',
    companyAskers: ['Stripe', 'Databricks', 'Cloudflare', 'LSEG'],
    summary:
      'Where algorithms meet infrastructure: protecting APIs from DDoS attacks and scaling data lookups.',
    keyTakeaways: [
      'Token Bucket allows traffic bursts while enforcing an average rate.',
      'Bloom Filters provide O(k) probabilistic set membership with zero false negatives.'
    ],
    interviewQuestions: [
      {
        question: 'How would you implement an API rate limiter in Redis for 100 req/min per user?',
        answerHint:
          'Use a Redis Token Bucket with Lua script to atomically decrement tokens based on timestamp, or use a Redis Sorted Set (ZSET) storing timestamps within a 60s sliding window.'
      }
    ]
  }
];

export const PrepRoadmapSection: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<'devops' | 'dsa'>('devops');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  // Store completed node IDs in localStorage
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('nexus_roadmap_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set(['devops-1-linux', 'devops-2-networking', 'dsa-1-arrays']);
    } catch {
      return new Set(['devops-1-linux', 'devops-2-networking']);
    }
  });

  useEffect(() => {
    localStorage.setItem('nexus_roadmap_completed', JSON.stringify(Array.from(completedNodeIds)));
  }, [completedNodeIds]);

  const currentNodes = activeTrack === 'devops' ? DEVOPS_ROADMAP : DSA_ROADMAP;
  const completedCount = currentNodes.filter((n) => completedNodeIds.has(n.id)).length;
  const progressPercent = Math.round((completedCount / currentNodes.length) * 100);

  const toggleComplete = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#30D158', '#0A84FF', '#BF5AF2']
        });
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Track Header & Switcher */}
      <div
        className="glass-surface shimmer-container"
        style={{
          padding: '24px 28px',
          borderRadius: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles style={{ width: '18px', height: '18px', color: 'var(--accent-blue)' }} />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '22px',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)'
              }}
            >
              Interactive Engineering Prep Roadmaps
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Curated milestone paths with real interview questions asked at Google, Stripe, Databricks, and LSEG.
          </p>
        </div>

        {/* Track Selector */}
        <div
          style={{
            background: 'var(--nav-track-bg)',
            padding: '5px',
            borderRadius: '980px',
            border: '1px solid var(--nav-track-border)',
            display: 'inline-flex',
            gap: '6px',
            boxShadow: 'var(--nav-track-shadow)'
          }}
        >
          <button
            onClick={() => setActiveTrack('devops')}
            style={{
              padding: '8px 20px',
              borderRadius: '980px',
              border: activeTrack === 'devops' ? '1px solid rgba(48, 209, 88, 0.45)' : '1px solid transparent',
              background: activeTrack === 'devops' ? 'rgba(48, 209, 88, 0.18)' : 'transparent',
              color: activeTrack === 'devops' ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Server style={{ width: '14px', height: '14px' }} />
            <span>DevOps & SRE Track</span>
          </button>

          <button
            onClick={() => setActiveTrack('dsa')}
            style={{
              padding: '8px 20px',
              borderRadius: '980px',
              border: activeTrack === 'dsa' ? '1px solid rgba(10, 132, 255, 0.45)' : '1px solid transparent',
              background: activeTrack === 'dsa' ? 'rgba(10, 132, 255, 0.18)' : 'transparent',
              color: activeTrack === 'dsa' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Code2 style={{ width: '14px', height: '14px' }} />
            <span>DSA & Algorithms Track</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div
        className="glass-surface"
        style={{
          padding: '16px 24px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award style={{ width: '22px', height: '22px', color: activeTrack === 'devops' ? 'var(--accent-green)' : 'var(--accent-blue)' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {activeTrack === 'devops' ? 'DevOps & SRE Platform Mastery' : 'Problem Solving & DSA Mastery'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {completedCount} of {currentNodes.length} milestones mastered ({progressPercent}%)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '320px' }}>
          <div
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '980px',
              background: 'var(--border-subtle)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background:
                  activeTrack === 'devops'
                    ? 'linear-gradient(90deg, #30D158, #00C7BE)'
                    : 'linear-gradient(90deg, #0077ED, #BF5AF2)',
                borderRadius: '980px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Interactive Visual Roadmap Grid with SVG Wires */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', position: 'relative' }}>
        {currentNodes.map((node, index) => {
          const isCompleted = completedNodeIds.has(node.id);
          const isSelected = selectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="glass-surface hover-lift animate-entrance"
              style={{
                padding: '20px 22px',
                borderRadius: '16px',
                cursor: 'pointer',
                border: isSelected
                  ? '1px solid var(--accent-blue)'
                  : isCompleted
                  ? '1px solid rgba(48, 209, 88, 0.4)'
                  : '1px solid var(--card-border)',
                background: isSelected
                  ? 'rgba(10, 132, 255, 0.10)'
                  : isCompleted
                  ? 'rgba(48, 209, 88, 0.06)'
                  : 'var(--card-bg)',
                boxShadow: 'var(--card-shadow)',
                animationDelay: `${index * 60}ms`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px'
              }}
            >
              <div>
                {/* Top badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isCompleted ? 'rgba(48, 209, 88, 0.2)' : 'var(--nav-track-bg)',
                        color: isCompleted ? 'var(--accent-green)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {node.stepNumber}
                    </span>

                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background:
                          node.importance === 'Critical'
                            ? 'rgba(255, 55, 95, 0.15)'
                            : 'rgba(255, 159, 10, 0.15)',
                        color:
                          node.importance === 'Critical'
                            ? 'var(--accent-pink)'
                            : 'var(--accent-orange)',
                        border:
                          node.importance === 'Critical'
                            ? '1px solid rgba(255, 55, 95, 0.3)'
                            : '1px solid rgba(255, 159, 10, 0.3)'
                      }}
                    >
                      {node.importance}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleComplete(node.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCompleted ? 'var(--accent-green)' : 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Mastered'}
                  >
                    <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontSize: '11px' }}>{isCompleted ? 'Mastered' : 'Pending'}</span>
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom: '4px'
                  }}
                >
                  {node.title}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
                  {node.subtitle}
                </p>

                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                  {node.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: 'var(--nav-track-bg)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  color: 'var(--text-tertiary)'
                }}
              >
                <span>Asked at: {node.companyAskers.slice(0, 3).join(', ')}</span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: 'var(--accent-blue)',
                    fontWeight: 600
                  }}
                >
                  <span>Prep Study</span>
                  <ChevronRight style={{ width: '13px', height: '13px' }} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Deep-Dive Drawer / Modal */}
      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-surface animate-entrance"
            style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid var(--border-default)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(10, 132, 255, 0.15)',
                      color: 'var(--accent-blue)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    STEP {selectedNode.stepNumber} · {selectedNode.importance}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Asked at {selectedNode.companyAskers.join(', ')}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '22px',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {selectedNode.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="btn-glass"
                style={{ padding: '6px 12px', borderRadius: '980px', fontSize: '12px' }}
              >
                Close
              </button>
            </div>

            {/* Concept Summary */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Architecture & Core Concepts
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '12px' }}>
                {selectedNode.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedNode.keyTakeaways.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Interview Questions */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen style={{ width: '14px', height: '14px', color: 'var(--accent-blue)' }} />
                <span>Real Interview Questions & Answer Blueprint</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedNode.interviewQuestions.map((iq, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--nav-track-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Q{i + 1}: {iq.question}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Blueprint: </span>
                      {iq.answerHint}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code / Manifest Snippet */}
            {selectedNode.codeSnippet && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal style={{ width: '14px', height: '14px', color: 'var(--accent-green)' }} />
                    <span>{selectedNode.codeSnippet.title}</span>
                  </h4>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                    {selectedNode.codeSnippet.language}
                  </span>
                </div>

                <pre
                  style={{
                    background: '#0D0D11',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: '#E0E0E6',
                    overflowX: 'auto',
                    lineHeight: 1.5
                  }}
                >
                  <code>{selectedNode.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => toggleComplete(selectedNode.id)}
                className="btn-glass"
                style={{
                  fontSize: '13px',
                  padding: '8px 18px',
                  borderRadius: '980px',
                  color: completedNodeIds.has(selectedNode.id) ? 'var(--accent-green)' : 'var(--text-primary)',
                  borderColor: completedNodeIds.has(selectedNode.id) ? 'rgba(48, 209, 88, 0.4)' : undefined,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                <span>{completedNodeIds.has(selectedNode.id) ? 'Marked as Mastered' : 'Mark as Mastered'}</span>
              </button>

              <button
                onClick={() => setSelectedNode(null)}
                className="btn-glass btn-blue"
                style={{ fontSize: '13px', padding: '8px 20px', borderRadius: '980px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
