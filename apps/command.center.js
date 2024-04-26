const course = new Courses({

    "courseCode": "CSE 101",
    "title": "Introduction to Computer Science",
    "year": "2023/2024",
    "level": 100,
    "semester": 1,
    "faculty": "Engineering",
    "program": "BSc. Computer Engineering",
    "lecturer": {
        "lecturerId": "TU-001FoCIS",
        "name": "Dr. Samuel Danso"
    },
    "students": [
        { "studentId": "1234567890" },
        { "studentId": "0987654321" }
    ],
    "chapters": [
        {
            "lessons": ["Lesson 1", "Lesson 2"],
            "courseMaterials": [
                {
                    "owner": "Dr. Samuel Danso",
                    "title": "Introduction Slides",
                    "filetype": "pdf",
                    "duration": { "hours": "0", "minutes": "30", "seconds": "0" },
                    "url": "https://example.com/intro_slides.pdf"
                },
                {
                    "owner": "Dr. Samuel Danso",
                    "title": "Fundamentals",
                    "filetype": "pdf",
                    "duration": { "hours": "0", "minutes": "30", "seconds": "0" },
                    "url": "https://example.com/intro_slides.pdf"
                }
            ],
            "courseLectureRecordings": [
                {
                    "title": "Lecture 1 Recording",
                    "dateRecorded": {
                        "day": "Monday",
                        "date": "01",
                        "month": "April",
                        "year": "2024",
                        "startTime": "10:00 AM",
                        "endTime": "11:30 AM"
                    },
                    "duration": { "hours": "1", "minutes": "30", "seconds": "0" },
                    "fileUrl": "https://example.com/lecture1_recording.mp4",
                    "attendance": {
                        "count": 30,
                        "expected": 35,
                        "attendees": [
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                        ],
                        "absentees": [
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "1234567890", "name": "Alice", "joined": "10:05 AM", "left": "11:25 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                            { "studentId": "0987654321", "name": "Bob", "joined": "10:10 AM", "left": "11:30 AM" },
                        ]
                    }
                }
            ],
            "submissions": [],
            "created-at": {
                "day": "Monday",
                "date": "01",
                "month": "April",
                "year": "2024"
            }
        }
    ],
    "schedule": {
        "day": "Monday",
        "time": "10:00 AM - 11:30 AM"
    },
    "created-at": {
        "day": "Monday",
        "date": "01",
        "month": "April",
        "year": "2024"
    }
});

// course.save();