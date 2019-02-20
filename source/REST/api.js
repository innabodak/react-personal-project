import { MAIN_URL, TOKEN } from './config';

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: tasks } = await response.json();

        // console.log(response);
        // console.log(tasks);

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: tasks } = await response.json();

        return tasks;
    },

    async removeTask (id) {
        console.log(`${MAIN_URL}/${id}`);
        await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },

    async updateTask (taskToUpdate) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([taskToUpdate]),
        });

        const {
            data: [updatedTask],
        } = await response.json();

        return updatedTask;
    },

    async completeAllTasks (tasksToComplete) {
        await Promise.all(tasksToComplete.map((task) => this.updateTask(task)));
    },
};
