
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Moon, Bell, LogOut, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SettingsModal = ({ isOpen, onClose, onLogout }: SettingsModalProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Settings
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5 text-gray-600" />
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-xs text-gray-500">
                    Switch between light and dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Notifications
                  </Label>
                  <p className="text-xs text-gray-500">
                    Enable or disable notifications
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>

          <Separator />

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
