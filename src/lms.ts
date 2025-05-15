// person base class
abstract class Person {
  constructor(public id: string, public name: string, public email: string) {}
  abstract getRole(): string;
}

class Student extends Person {
  courses: Enrollment[] = [];
  getRole() { return "Student"; }
}

class Professor extends Person {
  teachingCourses: Course[] = [];
  getRole() { return "Professor"; }
}

class Admin extends Person {
  getRole() { return "Admin"; }
}


// Grade & Enrollment
class Grade {
  private score: number;

  constructor(score: number) {
    this.score = score;
  }

  getLetterGrade(): string {
    if (this.score >= 90) return "A";
    if (this.score >= 80) return "B";
    if (this.score >= 70) return "C";
    if (this.score >= 60) return "D";
    return "F";
  }

  getScore(): number {
    return this.score;
  }

  setScore(score: number) {
    this.score = score;
  }
}

class Enrollment {
  constructor(public student: Student, public course: Course) {}

  private grades: Map<Assessment, Grade> = new Map();

  addGrade(assessment: Assessment, grade: Grade) {
    this.grades.set(assessment, grade);
  }

  getAverage(): number {
    const total = Array.from(this.grades.values()).reduce((sum, grade) => sum + grade.getScore(), 0);
    return total / this.grades.size;
  }
}

//  Assessment Interface
interface Assessment {
  title: string;
  maxScore: number;
  getType(): string;
}

class Quiz implements Assessment {
  constructor(public title: string, public maxScore: number) {}
  getType() { return "Quiz"; }
}

class Assignment implements Assessment {
  constructor(public title: string, public maxScore: number) {}
  getType() { return "Assignment"; }
}

class Project implements Assessment {
  constructor(public title: string, public maxScore: number) {}
  getType() { return "Project"; }
}


// Course Content
interface CourseContent {
  title: string;
  getContent(): string;
}

class Lecture implements CourseContent {
  constructor(public title: string, public content: string) {}
  getContent() { return `Lecture: ${this.title}`; }
}

class CompositeModule implements CourseContent {
  private items: CourseContent[] = [];

  constructor(public title: string) {}

  addItem(item: CourseContent) {
    this.items.push(item);
  }

  getContent(): string {
    return `Module: ${this.title}\n` + this.items.map(i => i.getContent()).join("\n");
  }
}


// Course Class
class Course {
  public students: Student[] = [];
  public assessments: Assessment[] = [];
  public content: CourseContent[] = [];

  constructor(public code: string, public title: string, public professor: Professor) {}

  enroll(student: Student) {
    this.students.push(student);
  }

  addAssessment(assessment: Assessment) {
    this.assessments.push(assessment);
  }

  addContent(content: CourseContent) {
    this.content.push(content);
  }
}


// notification system
interface Notification {
  send(recipient: Person, message: string): void;
}

class EmailNotification implements Notification {
  send(recipient: Person, message: string) {
    console.log(`Email to ${recipient.email}: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(recipient: Person, message: string) {
    console.log(`SMS to ${recipient.name}: ${message}`);
  }
}
