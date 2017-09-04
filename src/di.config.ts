/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Container, ContainerModule } from "inversify"
import {
    ClassNodeView, CompositionEdgeView, DashedEdgeView, ImportEdgeView, ModuleNodeView, NoteView,
    ArrowEdgeView, ChoiceNodeView, CaseNodeView, TagView, HeaderCompartmentView, DashedArrowEdgeView, UsesNodeView
} from "./views"
import { YangDiagramFactory } from "./model-factory"
import { popupModelFactory } from "./popup"
import {
    boundsModule,
    ConsoleLogger,
    defaultModule,
    exportModule,
    hoverModule,
    HtmlRootView,
    LogLevel,
    moveModule,
    overrideViewerOptions,
    PolylineEdgeView,
    PreRenderedView,
    SCompartmentView,
    selectModule,
    SGraphView,
    SLabelView,
    TYPES,
    undoRedoModule,
    viewportModule,
    ViewRegistry,
    expandModule,
    fadeModule,
    openModule,
    ExpandButtonHandler,
    ExpandButtonView,
    buttonModule,
    modelSourceModule
} from 'sprotty/lib'

const yangDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope()
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.log)
    rebind(TYPES.IModelFactory).to(YangDiagramFactory).inSingletonScope()
    bind(TYPES.PopupModelFactory).toConstantValue(popupModelFactory)
})

export default function createContainer(widgetId: string): Container {
    const container = new Container()
    container.load(defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        yangDiagramModule)
//        container.bind(TYPES.ModelSource).to(TheiaDiagramServer).inSingletonScope()
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId
    })

    // Register views
    const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry)
    viewRegistry.register('graph', SGraphView)
    viewRegistry.register('node:class', ClassNodeView)
    viewRegistry.register('node:module', ModuleNodeView)
    viewRegistry.register('node:choice', ChoiceNodeView)
    viewRegistry.register('node:case', CaseNodeView)
    viewRegistry.register('node:pill', UsesNodeView)
    viewRegistry.register('node:note', NoteView)
    viewRegistry.register('label:heading', SLabelView)
    viewRegistry.register('label:text', SLabelView)
    viewRegistry.register('ylabel:text', SLabelView)
    viewRegistry.register('label:classHeader', SLabelView)
    viewRegistry.register('label:classTag', TagView)
    viewRegistry.register('comp:comp', SCompartmentView)
    viewRegistry.register('comp:classHeader', HeaderCompartmentView)
    viewRegistry.register('edge:straight', PolylineEdgeView)
    viewRegistry.register('edge:composition', CompositionEdgeView)
    viewRegistry.register('edge:dashed', DashedEdgeView)
    viewRegistry.register('edge:import', ImportEdgeView)
    viewRegistry.register('edge:uses', DashedArrowEdgeView)
    viewRegistry.register('edge:augments', ArrowEdgeView)
    viewRegistry.register('html', HtmlRootView)
    viewRegistry.register('pre-rendered', PreRenderedView)
    viewRegistry.register(ExpandButtonHandler.TYPE, ExpandButtonView)

    return container
}