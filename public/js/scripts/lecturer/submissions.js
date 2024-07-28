function showCourseSubmissions(courseId) {
    // Remove active class from all items
    document.querySelectorAll('.carousel-item').forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    document.querySelector(`[onclick="showCourseSubmissions('${courseId}')"]`).classList.add('active');
    
    // Display submissions for the selected course
    const submissionsDiv = document.getElementById('course-submissions');
    submissionsDiv.innerHTML = ''; // Clear previous submissions

    // Fetch submissions data (this is just a placeholder; replace with actual data fetching)
    const submissions = getSubmissionsForCourse(courseId);

    // Insert submissions into the div
    submissions.forEach(submission => {
        const submissionDiv = document.createElement('div');
        submissionDiv.className = 'submission';
        submissionDiv.innerHTML = `
            <div class="submission-header">
                <h2>${submission.courseName}</h2>
                <span class="course-code">Course Code: ${submission.courseCode}</span>
                <button class="add-submission-btn">Add Submission</button>
                <button class="set-deadline-btn">Set Deadline</button>
                <button class="reject-submission-btn">Reject Submission</button>
            </div>
            <div class="submission-details">
                <p><strong>Lecturer:</strong> ${submission.lecturer}</p>
                <p><strong>Title:</strong> ${submission.title}</p>
                <p><strong>Release Date:</strong> ${submission.releaseDate}</p>
                <p><strong>Due Date:</strong> ${submission.dueDate}</p>
                <p class="status ${submission.status.toLowerCase()}"><strong>Status:</strong> ${submission.status}</p>
            </div>
        `;
        submissionsDiv.appendChild(submissionDiv);
    });
}

function getSubmissionsForCourse(courseId) {
    // Placeholder function to simulate fetching submissions data
    // Replace with actual data fetching logic
    return [
        {
            courseName: 'Course Name 1',
            courseCode: 'ABC123',
            lecturer: 'Dr. John Doe',
            title: 'Assignment 1',
            releaseDate: '2023-07-01',
            dueDate: '2023-07-15',
            status: 'Pending'
        },
        {
            courseName: 'Course Name 1',
            courseCode: 'ABC123',
            lecturer: 'Dr. John Doe',
            title: 'Assignment 2',
            releaseDate: '2023-07-05',
            dueDate: '2023-07-20',
            status: 'Submitted'
        }
    ];
}

// Initialize the first course as active
showCourseSubmissions('course1');
