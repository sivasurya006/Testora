































async function getAllPublishedTests(setCreatedTests, classroomId) {
    console.log("called")
    let status;
    try {
        const result = await api.get(`/studenttest/getStudentTests`, {
            headers: {
                'X-ClassroomId': classroomId
            }
        });
        if (result?.status == 200) {
            setCreatedTests(result.data);
        } else {
            console.log(`can't fetch created classrooms`);
        }
    } catch (err) {
        console.log(err)
    }
}