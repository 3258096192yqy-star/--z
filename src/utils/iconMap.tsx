import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  FolderGit2, 
  User, 
  Award,
  FileText,
  Code,
  Languages,
  Heart
} from 'lucide-react';

export const getSectionIcon = (title: string, className: string = "w-5 h-5") => {
  const t = title.toLowerCase();
  
  if (t.includes('教育') || t.includes('edu') || t.includes('school') || t.includes('大学')) {
    return <GraduationCap className={className} />;
  }
  if (t.includes('工作') || t.includes('经历') || t.includes('exp') || t.includes('work') || t.includes('实习') || t.includes('职业')) {
    return <Briefcase className={className} />;
  }
  if (t.includes('技能') || t.includes('skill') || t.includes('ability') || t.includes('特长')) {
    return <Wrench className={className} />;
  }
  if (t.includes('项目') || t.includes('project') || t.includes('作品')) {
    return <FolderGit2 className={className} />;
  }
  if (t.includes('关于') || t.includes('个人') || t.includes('about') || t.includes('profile') || t.includes('自我评价')) {
    return <User className={className} />;
  }
  if (t.includes('奖') || t.includes('荣誉') || t.includes('award') || t.includes('honor') || t.includes('证书')) {
    return <Award className={className} />;
  }
  if (t.includes('代码') || t.includes('code') || t.includes('编程')) {
    return <Code className={className} />;
  }
  if (t.includes('语言') || t.includes('language') || t.includes('英语')) {
    return <Languages className={className} />;
  }
  if (t.includes('爱好') || t.includes('hobby') || t.includes('interest') || t.includes('兴趣')) {
    return <Heart className={className} />;
  }
  
  return <FileText className={className} />;
};
