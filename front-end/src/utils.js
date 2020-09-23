
import {BADGE_COLORS, SOURCES_DISPLAY_NAME} from './app-constants';

export const getBadgeBgForSection = (section) => {
  return BADGE_COLORS[section] || BADGE_COLORS["other"]
}

export const getBadgeTxtClrForSection = (section) => {
  return (section.search("sport") != -1 || section.search("technology") != -1 || section.search("nyt") != -1) ? 'black': 'white';
}

export const getSrcDisplayName = (source) => {
  return SOURCES_DISPLAY_NAME[source] || "SOURCE"; 
}