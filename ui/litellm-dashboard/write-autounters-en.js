const fs = require('fs');

// Read existing en.json
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

// Add autoRouters namespace
if (!en.models.autoRouters) {
  en.models.autoRouters = {
    title: 'Auto Routers',
    description: 'Auto routers sit above your deployments and pick a model per request. They are called like any other model, so clients keep using a single model name.',
    addRouter: 'Add Auto Router',
    routerName: 'Router Name',
    strategy: 'Routing Strategy',
    models: 'Models',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    actions: 'Actions',
    deleteConfirm: 'Are you sure you want to delete this auto router?',
    deleted: 'Deleted auto router: {name}',
    deleteError: 'Failed to delete auto router: {error}',
    table: {
      name: 'Name',
      type: 'Type',
      routesTo: 'Routes to',
      defaultModel: 'Default model',
      createdAt: 'Created At',
      actions: 'Actions',
      delete: 'Delete auto router',
      deleteAria: 'Open actions for {name}',
    },
    emptyState: {
      title: 'No auto routers yet',
      descriptionCanModify: 'Create an auto router to pick the right model per request instead of pinning one.',
      descriptionNoModify: 'An auto router picks the right model per request instead of pinning one.',
    },
  };
}

if (!en.models.addAutoRouter) {
  en.models.addAutoRouter = {
    title: 'Add Auto Router',
    description: 'Choose a classifier to route each request to a model. Called like any other model, so clients keep using a single model name.',
    routerName: 'Router Name',
    routerNamePlaceholder: 'Enter router name',
    strategy: 'Routing Strategy',
    models: 'Models',
    modelsPlaceholder: 'Select models...',
    create: 'Create',
    cancel: 'Cancel',
    success: 'Auto router created successfully',
    error: 'Failed to create auto router',
  };
}

if (!en.models.autoRoutersPanel) {
  en.models.autoRoutersPanel = {
    title: 'Auto routers',
    description: 'Auto routers sit above your deployments and pick a model per request. They are called like any other model, so clients keep using a single model name.',
    addRouter: 'Add Auto Router',
    deleteConfirmTitle: 'Delete Auto Router',
    deleteConfirmMessage: 'Are you sure you want to delete "{name}"? Any client still calling this model name will start failing.',
    resourceInformationTitle: 'Auto router',
    resourceInformation: {
      name: 'Name',
      type: 'Type',
      id: 'ID',
    },
  };
}

fs.writeFileSync('src/messages/en.json', JSON.stringify(en, null, 2) + '\n');
console.log('en.json updated with autoRouters namespace');