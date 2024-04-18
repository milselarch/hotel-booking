import replaceAllInserter from 'string.prototype.replaceall';
import trimAllInserter from 'string.prototype.trim';


replaceAllInserter.shim();
trimAllInserter.shim();

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

