import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(err, info){ console.error("UI Error:", err, info); }
  render(){
    if (this.state.hasError) return <h2>Ocurrió un error. Reintentá.</h2>;
    return this.props.children;
  }
}
