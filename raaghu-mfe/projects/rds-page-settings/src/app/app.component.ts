import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ComponentLoaderOptions, EmailSettingsEditDto, HostBillingSettingsEditDto, HostSettingsEditDto, MfeBaseComponent, OtherSettingsEditDto, PasswordComplexitySetting, SecuritySettingsEditDto, SharedService, TenantManagementSettingsEditDto, TenantSettingsEditDto, TwoFactorLoginSettingsEditDto, UserLockOutSettingsEditDto } from '@libs/shared';
import { Store } from '@ngrx/store';
import { AlertService } from '@libs/shared';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { transition, trigger, query, style, animate, } from '@angular/animations';
import { getSettings, getSettingsTenantPageComboboxItems, sendTestmail, updateSettings } from 'projects/libs/state-management/src/lib/state/settings/settings.actions';
import { selectDefaultLanguage } from 'projects/libs/state-management/src/lib/state/language/language.selector';
import { selectAllSettings, selectSettingsTenantPageComboboxItems } from 'projects/libs/state-management/src/lib/state/settings/settings.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        query(':enter',
          [
            style({ opacity: 0 })
          ],
          { optional: true }
        ),
        query(':leave',
          [
            style({ opacity: 1 }),
            animate('1s', style({ opacity: 0 }))
          ],
          { optional: true }
        ),
        query(':enter',
          [
            style({ opacity: 0 }),
            animate('1s', style({ opacity: 1 }))
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  isAnimation: boolean = true;
  currentAlerts: any = [];
  editShimmer: boolean = false;
  @Input() showLoadingSpinner: boolean = false;
  public rdsAlertMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompAlert',
    input: {
      currentAlerts: this.currentAlerts
    },
    output: {
      onAlertHide: (event: any) => {
        this.currentAlerts = event;
      }
    }
  }

  @Input() rdsSettingData: any = [];
  @Input() listItems1 = [
    { value: 'Save All', some: 'value', key: 'saveall', icon: 'plus', iconWidth: '20px', iconHeight: '20px' },
  ];
  @Output() onDataSave = new EventEmitter<any>();
  // rdsCompTenantManageMfeConfig: ComponentLoaderOptions;
  // rdsCompUserManagementsMfeConfig: ComponentLoaderOptions;
  // rdsCompSecurityMfeConfig: ComponentLoaderOptions;
  // rdsCompEmailMfeConfig: ComponentLoaderOptions;
  // rdsCompInvoiceMfeConfig: ComponentLoaderOptions;
  // rdsCompOtherSettingsMfeConfig: ComponentLoaderOptions;

  public tenantmanagementData: any = {};
  public usermanagementdata: any = {};
  public securityData: any = {}
  public emailData: any = {};
  public invoiceInfoData: any = {};
  public otherSettingData: any = {};
  hostSetting: HostSettingsEditDto = new HostSettingsEditDto();
  saveHostSetting: HostSettingsEditDto = new HostSettingsEditDto();

  otherSettings: OtherSettingsEditDto = new OtherSettingsEditDto()
  invoicedata: HostBillingSettingsEditDto = new HostBillingSettingsEditDto();
  allsettings: any;

  navtabsItems: any = [
    {
      label: 'Tenant Management',
      tablink: '#tenant-management',
      ariacontrols: 'tenant-management',
    },
    {
      label: 'User Management',
      tablink: '#user-management',
      ariacontrols: 'user-management',
    },
    {
      label: 'Security',
      tablink: '#security',
      ariacontrols: 'settings',
    },
    {
      label: 'Email(SMTP)',
      tablink: '#email',
      ariacontrols: 'email',
    },
    {
      label: 'Invoice',
      tablink: '#invoice',
      ariacontrols: 'invoice',
    },
    {
      label: 'Other-settings',
      tablink: '#other-settings',
      ariacontrols: 'other-settings',
    },
  ];

  settingsTenantEditionList: any = [];
  tenantmanagementDataEdit: boolean = false;
  emailEdit: boolean = false;
  secturityEdit: boolean = false;
  userManagementEdit: boolean = false;
  generalEdit: boolean = false;
  billingEdit: boolean = false;
  otherSettingEdit: boolean = false;
  externalLoginProviderSettingsEdit: boolean = false;


  constructor(private injector: Injector,
    private store: Store,
    private alertService: AlertService,
    private sharedService: SharedService,
    public translate: TranslateService) {

  }
  rdsCompTenantManageMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompTenantManagement',
    input: {
      settings: this.tenantmanagementData,
      settingsTenantEditionList: this.settingsTenantEditionList,
      editShimmer: true
    },

    output: {
      tenantManagementData: (event) => {
        this.saveHostSetting.tenantManagement.allowSelfRegistration = event.allowSelfRegistration
        this.saveHostSetting.tenantManagement.defaultEditionId = event.defaultEditionId;
        this.saveHostSetting.tenantManagement.isNewRegisteredTenantActiveByDefault = event.isNewRegisteredTenantActiveByDefault;
        this.saveHostSetting.tenantManagement.useCaptchaOnRegistration = event.useCaptchaOnRegistration;
        this.tenantmanagementDataEdit = true;
      },
    },

  };
  rdsCompUserManagementsMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompUserManagement',
    input: {
      settingss: this.usermanagementdata,
      editShimmer: true
    },
    output: {
      UserManagementData: (event) => {

        this.saveHostSetting.userManagement.allowUsingGravatarProfilePicture = event.allowUsingGravatarProfilePicture;
        this.saveHostSetting.userManagement.isCookieConsentEnabled = event.isCookieConsentEnabled;
        this.saveHostSetting.userManagement.isEmailConfirmationRequiredForLogin = event.isEmailConfirmationRequiredForLogin
        this.saveHostSetting.userManagement.isQuickThemeSelectEnabled = this.hostSetting.userManagement.isQuickThemeSelectEnabled
        this.saveHostSetting.userManagement.sessionTimeOutSettings = this.hostSetting.userManagement.sessionTimeOutSettings
        this.saveHostSetting.userManagement.useCaptchaOnLogin = event.useCaptchaOnLogin;
        this.saveHostSetting.userManagement.smsVerificationEnabled = event.smsVerificationEnabled;
        this.saveHostSetting.userManagement.userPasswordSettings = this.hostSetting.userManagement.userPasswordSettings
        this.userManagementEdit = true;
      }
    }
  };
  rdsCompSecurityMfeConfig: ComponentLoaderOptions = {
    name: 'RdsSecurity',
    input: {
      setting: this.securityData,
      editShimmer: true
    },
    output: {
      securityData: (event) => {
        this.saveHostSetting.security.passwordComplexity = new PasswordComplexitySetting();
        this.saveHostSetting.security.userLockOut = new UserLockOutSettingsEditDto();
        this.saveHostSetting.security.twoFactorLogin = new TwoFactorLoginSettingsEditDto();
        this.saveHostSetting.security.passwordComplexity.requireDigit = event.requireDigit;
        this.saveHostSetting.security.passwordComplexity.requiredLength = event.requiredLength;
        this.saveHostSetting.security.passwordComplexity.requireLowercase = event.requireLowercase;
        this.saveHostSetting.security.passwordComplexity.requireNonAlphanumeric = event.requireAlphaNumeric;
        this.saveHostSetting.security.passwordComplexity.requireUppercase = event.requireUppercase;
        this.saveHostSetting.security.userLockOut.defaultAccountLockoutSeconds = event.defaultAccountLockoutSeconds;
        this.saveHostSetting.security.userLockOut.maxFailedAccessAttemptsBeforeLockout = event.maxFailedAccessAttemptsBeforeLockout;
        this.saveHostSetting.security.userLockOut.isEnabled = event.isEnabled;
        this.saveHostSetting.security.allowOneConcurrentLoginPerUser = this.hostSetting.security.allowOneConcurrentLoginPerUser;
        this.saveHostSetting.security.useDefaultPasswordComplexitySettings = event.useDefaultPasswordComplexitySettings;
        this.saveHostSetting.security.twoFactorLogin = this.hostSetting.security.twoFactorLogin;
        this.secturityEdit = true;
      }
    }
  };
  rdsCompEmailMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompEmail',
    input: {
      emailData: this.emailData,
      editShimmer: true
    },
    output: {
      EmailtData: (event) => {
        this.saveHostSetting.email.defaultFromAddress = event.defaultFromAddress;
        this.saveHostSetting.email.defaultFromDisplayName = event.defaultFromDisplayName;
        this.saveHostSetting.email.smtpHost = event.smtpHost;
        this.saveHostSetting.email.smtpPort = event.smtpPort;
        this.saveHostSetting.email.smtpDomain = event.smtpDomain;
        this.saveHostSetting.email.smtpUseDefaultCredentials = event.smtpUseDefaultCredentials;
        this.saveHostSetting.email.smtpEnableSsl = event.smtpEnableSsl;
        this.emailEdit = true;
      },
      SendTestEmailData: (event) => {
        const data: any = {
          emailAddress: event
        }
        this.store.dispatch(sendTestmail(data));
      }
    }
  };
  rdsCompInvoiceMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompInvoice',
    input: {
      invoiceData: this.invoiceInfoData,
      editShimmer: true
    },
    output: {
      InvoiceData: (event) => {
        this.invoicedata.address = event.address
        this.invoicedata.legalName = event.legalName;
        // this.saveHostSetting.billing.address=event.address;
        this.billingEdit = true;
      },
    },
  };
  rdsCompOtherSettingsMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompOtherSettings',
    input: {
      setting: this.otherSettingData,
      editShimmer: true
    },
    output: {
      OtherSettingData: (event) => {
        this.otherSettings.isQuickThemeSelectEnabled = event.isQuickThemeSelectEnabled
        // const othersetting: any={
        //   isQuickThemeSelectEnabled:event.isQuickThemeSelectEnabled
        // }
        // this.otherSettings=othersetting
        // this.saveHostSetting.otherSettings.isQuickThemeSelectEnabled=event.isQuickThemeSelectEnabled;
        this.otherSettingEdit = true;
      }
    }
  };

  ngOnInit(): void {
    this.isAnimation = true;
    this.store.select(selectDefaultLanguage).subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
        this.navtabsItems[0].label = this.translate.instant('Tenant Management');
        this.navtabsItems[1].label = this.translate.instant('User Management');
        this.navtabsItems[2].label = this.translate.instant('Security');
        this.navtabsItems[3].label = this.translate.instant('Email(SMTP)');
        this.navtabsItems[4].label = this.translate.instant('Invoice');
        this.navtabsItems[5].label = this.translate.instant('Other-Settings');
      }
    })

    this.subscribeToAlerts();

    this.store.dispatch(getSettingsTenantPageComboboxItems())
    this.store.select(selectSettingsTenantPageComboboxItems).subscribe((res: any) => {
    // console.log('tenant dropdown : ', res)
    if (res) {
        this.settingsTenantEditionList = [];
        res.forEach(el=>{
          const data = {
            value:el.value,
            some:el.displayText,
            isSelected:el.isSelected,
            icon:'',
            iconWidth:0,
            iconHeight:0,
            iconFill:false,
            iconStroke: true,
            isFree: el.isFree
          }
          this.settingsTenantEditionList.push(data);
        });

        //this.settingsTenantEditionList = res.editionComboboxItem.filter((x: any) => x.isFree);
        const mfeConfig = this.rdsCompTenantManageMfeConfig
        mfeConfig.input.settingsTenantEditionList = [...this.settingsTenantEditionList];
        mfeConfig.input.editShimmer = false;
        this.rdsCompTenantManageMfeConfig = mfeConfig;
      }
    });
    this.store.dispatch(getSettings());
    this.store.select(selectAllSettings).subscribe((res: any) => {
      this.isAnimation = false;
      console.log(res);
      if (res) {
        this.hostSetting.general = res.general;
        this.hostSetting.externalLoginProviderSettings = res.externalLoginProviderSettings;
        if (res.billing) {
          this.hostSetting.billing = res.billing;
          this.invoiceInfoData.legalName = res.billing.legalName;
          this.invoiceInfoData.address = res.billing.address;
          const mfeConfig = this.rdsCompInvoiceMfeConfig
          mfeConfig.input.InvoiceDataForm = { ... this.invoiceInfoData };
          mfeConfig.input.editShimmer = false;
          this.rdsCompInvoiceMfeConfig = mfeConfig;
        }
        if (res.tenantManagement) {
          this.hostSetting.tenantManagement = res.tenantManagement
          this.tenantmanagementData.isNewRegisteredTenantActiveByDefault = res.tenantManagement.isNewRegisteredTenantActiveByDefault;
          this.tenantmanagementData.defaultEditionId = res.tenantManagement.defaultEditionId;
          this.tenantmanagementData.useCaptchaOnRegistration = res.tenantManagement.useCaptchaOnRegistration;
          this.tenantmanagementData.allowSelfRegistration = res.tenantManagement.allowSelfRegistration;
          const mfeConfig = this.rdsCompTenantManageMfeConfig
          mfeConfig.input.settings = { ... this.tenantmanagementData };
          mfeConfig.input.editShimmer = false;
          this.rdsCompTenantManageMfeConfig = mfeConfig;
        }

        if (res.otherSettings) {
          this.hostSetting.otherSettings = res.otherSettings;
          this.otherSettingData.isQuickThemeSelectEnabled = res.otherSettings.isQuickThemeSelectEnabled;
          const mfeConfig = this.rdsCompOtherSettingsMfeConfig
          mfeConfig.input.OtherSetting = { ... this.otherSettingData };
          mfeConfig.input.editShimmer = false;
          this.rdsCompOtherSettingsMfeConfig = mfeConfig;
        }
        if (res.userManagement) {
          this.hostSetting.userManagement = res.userManagement;
          this.usermanagementdata.isEmailConfirmationRequiredForLogin = res.userManagement.isEmailConfirmationRequiredForLogin;
          this.usermanagementdata.useCaptchaOnLogin = res.userManagement.useCaptchaOnLogin;
          this.usermanagementdata.isCookieConsentEnabled = res.userManagement.isCookieConsentEnabled;
          this.usermanagementdata.allowUsingGravatarProfilePicture = res.userManagement.allowUsingGravatarProfilePicture;
          this.usermanagementdata.smsVerificationEnabled = res.userManagement.smsVerificationEnabled;
          if (res.userManagement.sessionTimeOutSettings) {
            this.usermanagementdata.sessionTimeOutSettings = res.userManagement.sessionTimeOutSettings.isEnabled;
          }
          const mfeConfig = this.rdsCompUserManagementsMfeConfig
          mfeConfig.input.Usermanagementsettings = { ... this.usermanagementdata };
          mfeConfig.input.editShimmer = false;
          this.rdsCompUserManagementsMfeConfig = mfeConfig;
        }
        if (res.security) {
          this.hostSetting.security = res.security;
          this.securityData.useDefaultPasswordComplexitySettings = res.security.useDefaultPasswordComplexitySettings;
          this.securityData.allowOneConcurrentLoginPerUser = res.security.allowOneConcurrentLoginPerUser;
          if (res.security.passwordComplexity) {
            this.securityData.requireDigit = res.security.passwordComplexity.requireDigit;
            this.securityData.requireLowercase = res.security.passwordComplexity.requireLowercase;
            this.securityData.requireAlphaNumeric = res.security.passwordComplexity.requireNonAlphanumeric;
            this.securityData.requireUppercase = res.security.passwordComplexity.requireUppercase;
            this.securityData.requiredLength = res.security.passwordComplexity.requiredLength;
          }

          if (res.security.userLockOut) {
            this.securityData.maxFailedAccessAttemptsBeforeLockout = res.security.userLockOut.maxFailedAccessAttemptsBeforeLockout;
            this.securityData.defaultAccountLockoutSeconds = res.security.userLockOut.defaultAccountLockoutSeconds;
            this.securityData.userLockout = res.security.userLockOut.isEnabled
          }
          if (res.security.twoFactorLogin.isEnabled) {
            this.securityData.twoFactorLogin = res.security.twoFactorLogin.isEnabled
          }
          const mfeConfig = this.rdsCompSecurityMfeConfig
          mfeConfig.input.Seccuritysetting = { ... this.securityData };
          mfeConfig.input.editShimmer = false;
          this.rdsCompSecurityMfeConfig = mfeConfig;
        }
        if (res.email) {
          this.hostSetting.email = res.email;
          this.emailData.smtpEnableSsl = res.email.smtpEnableSsl;
          this.emailData.smtpUseDefaultCredentials = res.email.smtpUseDefaultCredentials;
          this.emailData.defaultFromAddress = res.email.defaultFromAddress;
          this.emailData.defaultFromDisplayName = res.email.defaultFromDisplayName;
          this.emailData.smtpHost = res.email.smtpHost;
          this.emailData.smtpPort = res.email.smtpPort;
          this.emailData.smtpDomain = res.email.smtpDomain;
          const mfeConfig = this.rdsCompEmailMfeConfig
          mfeConfig.input.EmailData = { ... this.emailData };
          mfeConfig.input.editShimmer = false;
          this.rdsCompEmailMfeConfig = mfeConfig;
        }
      }
    });
  }


  onSave(): void {
    this.showLoadingSpinner = true;
    let hostSettingprivate: HostSettingsEditDto = new HostSettingsEditDto();
    hostSettingprivate.tenantManagement = this.tenantmanagementDataEdit ? this.saveHostSetting.tenantManagement : this.hostSetting.tenantManagement;
    hostSettingprivate.billing = this.billingEdit ? this.invoicedata : this.hostSetting.billing;
    hostSettingprivate.email = this.emailEdit ? this.saveHostSetting.email : this.hostSetting.email;
    hostSettingprivate.externalLoginProviderSettings = this.externalLoginProviderSettingsEdit ? this.saveHostSetting.externalLoginProviderSettings : this.hostSetting.externalLoginProviderSettings
    hostSettingprivate.general = this.generalEdit ? this.saveHostSetting.general : this.hostSetting.general
    hostSettingprivate.otherSettings = this.otherSettingEdit ? this.otherSettings : this.hostSetting.otherSettings
    hostSettingprivate.security = this.secturityEdit ? this.saveHostSetting.security : this.hostSetting.security
    hostSettingprivate.userManagement = this.userManagementEdit ? this.saveHostSetting.userManagement : this.hostSetting.userManagement
    this.store.dispatch(updateSettings(hostSettingprivate));
    //this.saveHostSetting = new HostSettingsEditDto();
    //this.otherSettings = new OtherSettingsEditDto();
    //this.invoicedata = new HostBillingSettingsEditDto();
    //this.emailData = new EmailSettingsEditDto();
    //this.hostSetting = new HostSettingsEditDto();
    //this.securityData = new SecuritySettingsEditDto();
    this.tenantmanagementDataEdit = false;
    this.billingEdit = false;
    this.emailEdit = false;
    this.generalEdit = false;
    this.externalLoginProviderSettingsEdit = false;
    this.secturityEdit = false;
    this.userManagementEdit = false;
  }

  subscribeToAlerts() {
    this.alertService.alertEvents.subscribe((alert) => {
      this.currentAlerts = [];
      const currentAlert: any = {
        type: alert.type,
        title: alert.title,
        message: alert.message,
      };
      this.currentAlerts.push(currentAlert);
      this.showLoadingSpinner = false;
      const rdsAlertMfeConfig = this.rdsAlertMfeConfig;
      rdsAlertMfeConfig.input.currentAlerts = [...this.currentAlerts];
      this.rdsAlertMfeConfig = rdsAlertMfeConfig;
    });

  }

  getNavtabItems(): any {
    this.navtabsItems[0].label = this.translate.instant('Tenant Management');
    this.navtabsItems[1].label = this.translate.instant('User Management');
    this.navtabsItems[2].label = this.translate.instant('Security');
    this.navtabsItems[3].label = this.translate.instant('Email(SMTP)');
    this.navtabsItems[4].label = this.translate.instant('Invoice');
    this.navtabsItems[5].label = this.translate.instant('Other-Settings');
    return this.navtabsItems;
  }

  // fabmenu mobile
  onSelectMenu(event: any) {
    if (event.key === 'saveall') {
      this.onSave();
      alert();
    }
  }

  public onClicktab(event): void {
    if (event > 0) {
      this.sharedService.setTopNavTitle(this.navtabsItems[event].label);
    } else {
      this.sharedService.setTopNavTitle('');
    }
  }

}



