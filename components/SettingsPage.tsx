import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { AccessibilitySettings } from './AccessibilitySettings';
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Eye,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Mail,
  Lock
} from 'lucide-react';

interface SettingsPageProps {
  userProfile?: any;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onProfileUpdate?: (profile: any) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userProfile,
  theme,
  onThemeToggle,
  onProfileUpdate
}) => {
  const [notifications, setNotifications] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    gradeAlerts: false,
    systemAnnouncements: true
  });

  const [privacy, setPrivacy] = React.useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    analytics: true
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white mb-2">Settings</h1>
        <p className="text-[#475569] dark:text-gray-300">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userProfile?.name || ''}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id">Student ID</Label>
                  <Input
                    id="id"
                    value={userProfile?.id || ''}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userProfile?.email || ''}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userProfile?.phone || ''}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value={userProfile?.course || ''}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Input
                    id="semester"
                    value={userProfile?.semester || ''}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Badge variant="outline" className="text-xs">
                  Profile information is read-only and managed by the university
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={onThemeToggle}
                  />
                  <Moon className="w-4 h-4" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Theme Preview</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-white border-gray-200">
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-8 bg-blue-500 rounded w-1/2"></div>
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-600">Light Theme</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-900 border-gray-700">
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-700 rounded"></div>
                      <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-8 bg-blue-400 rounded w-1/2"></div>
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-300">Dark Theme</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: 'emailNotifications',
                  label: 'Email Notifications',
                  description: 'Receive notifications via email',
                  icon: Mail
                },
                {
                  key: 'pushNotifications',
                  label: 'Push Notifications',
                  description: 'Receive browser push notifications',
                  icon: Smartphone
                },
                {
                  key: 'courseUpdates',
                  label: 'Course Updates',
                  description: 'Get notified about course announcements and updates'
                },
                {
                  key: 'assignmentReminders',
                  label: 'Assignment Reminders',
                  description: 'Reminders for upcoming assignment deadlines'
                },
                {
                  key: 'gradeAlerts',
                  label: 'Grade Alerts',
                  description: 'Notifications when new grades are posted'
                },
                {
                  key: 'systemAnnouncements',
                  label: 'System Announcements',
                  description: 'Important announcements from the university'
                }
              ].map((item, index) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                  {index < 5 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilitySettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Profile Visibility</Label>
                  <div className="space-y-2">
                    {['public', 'university', 'private'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={option}
                          name="profileVisibility"
                          value={option}
                          checked={privacy.profileVisibility === option}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Label htmlFor={option} className="capitalize cursor-pointer">
                          {option} {option === 'university' && '(BITS Community only)'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {[
                  {
                    key: 'showEmail',
                    label: 'Show Email in Profile',
                    description: 'Allow others to see your email address'
                  },
                  {
                    key: 'showPhone',
                    label: 'Show Phone in Profile', 
                    description: 'Allow others to see your phone number'
                  },
                  {
                    key: 'dataCollection',
                    label: 'Allow Data Collection',
                    description: 'Help improve the platform with usage analytics'
                  },
                  {
                    key: 'analytics',
                    label: 'Performance Analytics',
                    description: 'Track performance data to provide insights'
                  }
                ].map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={privacy[item.key as keyof typeof privacy]}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, [item.key]: checked }))
                        }
                      />
                    </div>
                    {index < 3 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Your data is protected according to university privacy policies and GDPR compliance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
