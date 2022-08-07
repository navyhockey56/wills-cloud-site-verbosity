// interface VBSStateListener {
//   onStateChange(state: VBSState) : void;
// }

// export class VBSState {
//   private state : Record<string, any>;
//   private listeners : VBSStateListener[];

//   updateState(updatedState : Record<string, any>) {
//     this.state = { ...updatedState, ...this.state };
//     this.listeners.forEach(listener => listener.onStateChange(this));
//   }
// }
