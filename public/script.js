const tasksDom = document.querySelector('.tasks');
const formDom = document.querySelector('.task-form');
const taskInputDom = document.querySelector('.task-input');
const formAlertDom = document.querySelector('.form-alert');

// /api/v1/tasksからタスクを取得して表示する
const showTasks = async () => {
    try {
        //自作のAPIを叩く
        const { data: tasks } = await axios.get('/api/v1/tasks');

        //タスクが一つもない場合
        if (tasks.length < 1) {
            tasksDom.innerHTML = '<p class="empty-list">タスクがありません</p>';
            return;
        }


        if (Array.isArray(tasks)) {  // tasksが配列であるか確認
            const allTasks = tasks.map((task) => {
                const { completed, _id, name } = task;

                return `  <div class="single-task ${completed && "task-completed"}">
                <h5>
                    <span><i class="far fa-check-circle"></i></span>${name}
                </h5>
                <!-- 編集リンク -->
                <div class="task-links">
                    <a href="edit.html?id=${_id}" class="edit-link">
                        <i class="fas fa-edit"></i>

                    </a>
                    <!-- ゴミ箱リンク -->
                    <button type="button" class="delete-btn" data-id=${_id}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
            }).join('');
            tasksDom.innerHTML = allTasks;
        } else {
            console.log('tasks is not an array');
        }

    } catch (err) {
        console.log(err);
    }
};

showTasks();

//タスクを新規作成する
formDom.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = taskInputDom.value;
    try {
        await axios.post('/api/v1/tasks', { name: name });
        showTasks();
        taskInputDom.value = '';
        formAlertDom.style.display = 'block';
        formAlertDom.innerHTML = "タスクを追加しました。";
        formAlertDom.classList.add('text-success');
    } catch (err) {
        console.log(err);
        formAlertDom.style.display = 'block';
        formAlertDom.classList.remove('text-success');
        formAlertDom.innerHTML = "もう一度やり直してください。";
    }
    setTimeout(() => {
        formAlertDom.style.display = 'none';
    }, 3000);
});

//タスクを削除する

tasksDom.addEventListener('click', async (event) => {
    const element = event.target;
    if (element.parentElement.classList.contains('delete-btn')) {
        const taskId = element.parentElement.dataset.id;
        try {
            await axios.delete(`/api/v1/tasks/${taskId}`);
            showTasks();
        } catch (err) {
            console.log(err);
        }
    }
});