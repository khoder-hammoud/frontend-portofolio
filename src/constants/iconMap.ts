import type { ComponentType } from 'react';
import { 
  Code2, Layout, Server, Atom, Wind, Cpu, Cloud, Database, Globe, Shield, Terminal, Activity, Zap, Briefcase, Settings, Mail, Linkedin, Github, X
} from 'lucide-react';
import {
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte, SiTypescript, SiJavascript, SiHtml5, SiCss, SiTailwindcss, SiBootstrap,
  SiNodedotjs, SiExpress, SiNestjs, SiDeno, SiPython, SiDjango, SiFlask, SiPhp, SiLaravel, SiRuby, SiGo, SiRust, SiKotlin, SiSwift,
  SiMongodb, SiPostgresql, SiMysql, SiSqlite, SiRedis, SiElasticsearch, SiFirebase, SiSupabase, SiPlanetscale,
  SiDocker, SiKubernetes, SiGooglecloud, SiNginx, SiLinux, SiGit, SiGithubactions,
  SiFigma, SiCanva, SiStorybook, SiJest, SiCypress, SiTestinglibrary,
  SiGraphql, SiTrpc, SiPrisma, SiDrizzle, SiWebpack, SiVite, SiBabel,
  SiFramer, SiSass, SiMui, SiShadcnui, SiChakraui, SiAntdesign, SiRadixui
} from 'react-icons/si';

export type IconComponent = ComponentType<{ size?: number; className?: string }>;

export const ICON_MAP: Record<string, IconComponent> = {
  Code2, Layout, Server, Atom, Wind, Cpu, Cloud, Database, Globe, Shield, Terminal, Activity, Zap, Briefcase, Settings, Mail, Linkedin, Github, X,
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte, SiTypescript, SiJavascript, SiHtml5, SiCss, SiTailwindcss, SiBootstrap,
  SiNodedotjs, SiExpress, SiNestjs, SiDeno, SiPython, SiDjango, SiFlask, SiPhp, SiLaravel, SiRuby, SiGo, SiRust, SiKotlin, SiSwift,
  SiMongodb, SiPostgresql, SiMysql, SiSqlite, SiRedis, SiElasticsearch, SiFirebase, SiSupabase, SiPlanetscale,
  SiDocker, SiKubernetes, SiGooglecloud, SiNginx, SiLinux, SiGit, SiGithubactions,
  SiFigma, SiCanva, SiStorybook, SiJest, SiCypress, SiTestinglibrary,
  SiGraphql, SiTrpc, SiPrisma, SiDrizzle, SiWebpack, SiVite, SiBabel,
  SiFramer, SiSass, SiMui, SiShadcnui, SiChakraui, SiAntdesign, SiRadixui
};

export const ICON_GROUPS = {
  lucide: ['Code2', 'Layout', 'Server', 'Atom', 'Wind', 'Cpu', 'Cloud', 'Database', 'Globe', 'Shield', 'Terminal', 'Activity', 'Zap', 'Briefcase', 'Settings', 'Mail', 'Linkedin', 'Github', 'X'],
  techIcons: [
    'SiReact', 'SiNextdotjs', 'SiVuedotjs', 'SiAngular', 'SiSvelte',
    'SiTypescript', 'SiJavascript', 'SiHtml5', 'SiCss', 'SiTailwindcss',
    'SiNodedotjs', 'SiExpress', 'SiNestjs', 'SiPython', 'SiGo', 'SiRust',
    'SiMongodb', 'SiPostgresql', 'SiMysql', 'SiRedis',
    'SiDocker', 'SiKubernetes', 'SiGooglecloud',
    'SiFigma', 'SiStorybook', 'SiJest', 'SiGraphql',
    'SiPrisma', 'SiVite', 'SiFramer', 'SiMui', 'SiShadcnui'
  ]
};
