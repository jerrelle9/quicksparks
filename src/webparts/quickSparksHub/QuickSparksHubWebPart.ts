import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import QuickSparksHub from './components/QuickSparksHub';
import { IDataService } from './services/IDataService';
import { createDataService } from './services/ServiceFactory';

export interface IQuickSparksHubWebPartProps {
    useMockData: boolean;
}

export default class QuickSparksHubWebPart extends BaseClientSideWebPart<IQuickSparksHubWebPartProps> {
    private _dataService: IDataService | null = null;

    protected onInit(): Promise<void> {
        this._dataService = createDataService(this.properties.useMockData !== false);
        return Promise.resolve();
    }

    public render(): void {
        if (!this._dataService) {
            return;
        }

        const element = React.createElement(QuickSparksHub, {
            dataService: this._dataService,
        });

        ReactDom.render(element, this.domElement);
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: 'QuickSparks Hub Settings',
                    },
                    groups: [
                        {
                            groupName: 'Data Source',
                            groupFields: [
                                PropertyPaneToggle('useMockData', {
                                    label: 'Use mock data',
                                    onText: 'Mock data',
                                    offText: 'SharePoint data',
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
