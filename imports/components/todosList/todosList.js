import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';
import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.hideCompleted = false;

    this.helpers({
      tasks() {
        const selector = {};

        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        // Show newest tasks at the top
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      currentUser() {
        return Meteor.user();
      }
    })
  }

  addTask(newTask) {
    Tasks.insert({
      text: newTask,
      createdAt: new Date,
      owner: Meteor.userId(),
      username: Meteor.user().username
    });

    this.newTask = '';
  }

  setChecked(task) {
    Tasks.update(task._id, {
      $set: { checked: !task.checked },
    });
  }

  removeTask(task) {
    Tasks.remove(task._id);
  }

}

export default angular.module('todosList', [angularMeteor])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });
