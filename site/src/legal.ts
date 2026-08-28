import './styles.css';
import { focusHeadingAfterNavigation, markInternalNavigations } from './navigation';

markInternalNavigations();
window.addEventListener('pageshow', focusHeadingAfterNavigation);
