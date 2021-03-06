import * as path from 'path';
import { folderExists } from '../utils';
import { addModuleToActions, addModuleToGetters, addModuleToMutations, addModuleToRoutes } from '../ast';

export = {
  description: 'Add a module with mutations and routing information',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      validate: (value: string) => {
        if (!value || value.length === 0) {
          return 'name is required';
        }

        return folderExists(value) ? `folder already exists (${value})` : true;
      }
    },
    {
      type: 'confirm',
      name: 'wantRoutes',
      default: true,
      message: 'Do you want routes?'
    },
    {
      type: 'confirm',
      name: 'wantVuex',
      default: true,
      message: 'Do you want vuex?'
    }],
  actions: (data: any) => {
    const pathArray: string[] = data.name.split('/');

    data.moduleName = pathArray.pop();
    data.componentName = data.moduleName;
    data.basePath = '../src/app/' + pathArray.join('/');

    const actions: any[] = [
      {
        type: 'add',
        path: '{{basePath}}/{{camelCase moduleName}}/{{properCase componentName}}/{{properCase componentName}}.vue',
        templateFile: './connected/connected.vue.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: '{{basePath}}/{{camelCase moduleName}}/{{properCase componentName}}/{{properCase componentName}}.spec.ts',
        templateFile: './connected/connected.spec.ts.hbs',
        abortOnFail: true
      }];

    if (data.wantRoutes) {
      actions.push({
        type: 'add',
        path: '{{basePath}}/{{camelCase moduleName}}/routes.ts',
        templateFile: './module/routes.ts.hbs',
        abortOnFail: true
      });

      addModuleToRoutes(path.join(path.resolve(process.cwd()), 'src', 'app', 'router.ts'), data.moduleName);
    }

    if (data.wantVuex) {
      actions.push({
        type: 'add',
        path: '{{basePath}}/{{camelCase moduleName}}/actions.ts',
        templateFile: './module/actions.ts.hbs',
        abortOnFail: true
      });
      actions.push({
        type: 'add',
        path: '{{basePath}}/{{camelCase moduleName}}/getters.ts',
        templateFile: './module/getters.ts.hbs',
        abortOnFail: true
      });
      actions.push({
        type: 'add',
        path: '{{basePath}}/{{camelCase moduleName}}/mutations.ts',
        templateFile: './module/mutations.ts.hbs',
        abortOnFail: true
      });
      addModuleToActions(path.join(path.resolve(process.cwd()), 'src', 'app', 'actions.ts'), data.moduleName);
      addModuleToGetters(path.join(path.resolve(process.cwd()), 'src', 'app', 'getters.ts'), data.moduleName);
      addModuleToMutations(path.join(path.resolve(process.cwd()), 'src', 'app', 'mutations.ts'), data.moduleName);
    }

    return actions;
  }
};
