// ReasoningGraphStore.js
// Responsibility:
// - ऑफ़लाइन reasoning के लिए Graph-based Memory Store
// - प्रश्न → संदर्भ → उत्तर के संबंध सुरक्षित करना
// - IndexedDB आधारित, large-scale (40GB ready)
// Rule-based | Deterministic | Offline-only | Voice-safe

export class ReasoningGraphStore {

  constructor() {
    this.db = null;
    this.ready = false;
    this.DB_NAME = "ANJALI_REASONING_GRAPH_DB";
    this.DB_VERSION = 1;
    this._init();
  }

  /* =====================================================
     INIT
  ===================================================== */
  _init() {
    const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      // Nodes: concepts / questions / answers
      if (!db.objectStoreNames.contains("nodes")) {
        db.createObjectStore("nodes", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      // Edges: relations between nodes
      if (!db.objectStoreNames.contains("edges")) {
        db.createObjectStore("edges", {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    req.onsuccess = (e) => {
      this.db = e.target.result;
      this.ready = true;
    };

    req.onerror = () => {
      console.error("ReasoningGraphStore: IndexedDB init failed");
      this.ready = false;
    };
  }

  /* =====================================================
     NODE OPERATIONS
  ===================================================== */
  addNode(type, value) {
    if (!this.ready) return;

    const tx = this.db.transaction("nodes", "readwrite");
    const store = tx.objectStore("nodes");

    store.add({
      type,              // e.g. "question", "answer", "concept"
      value,             // string
      timestamp: Date.now()
    });
  }

  /* =====================================================
     EDGE OPERATIONS
  ===================================================== */
  addEdge(fromNodeId, toNodeId, relation) {
    if (!this.ready) return;

    const tx = this.db.transaction("edges", "readwrite");
    const store = tx.objectStore("edges");

    store.add({
      from: fromNodeId,
      to: toNodeId,
      relation,          // e.g. "leads_to", "explains", "contradicts"
      timestamp: Date.now()
    });
  }

  /* =====================================================
     QUERY (SAFE, READ-ONLY)
  ===================================================== */
  getAllNodes(callback) {
    if (!this.ready) {
      callback([]);
      return;
    }

    const tx = this.db.transaction("nodes", "readonly");
    const store = tx.objectStore("nodes");
    const req = store.getAll();

    req.onsuccess = () => callback(req.result || []);
  }

  getAllEdges(callback) {
    if (!this.ready) {
      callback([]);
      return;
    }

    const tx = this.db.transaction("edges", "readonly");
    const store = tx.objectStore("edges");
    const req = store.getAll();

    req.onsuccess = () => callback(req.result || []);
  }
}
