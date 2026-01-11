import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { CopyButton } from "@/components/animate-ui/buttons/copy";
import {
  Trash,
  Eye,
  EyeOff,
  PenLine,
  Globe,
  Clipboard,
  CalendarClock,
  Edit,
  History,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { removePassword } from "@/models/Users";
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { getURL } from "@/utils/GetURL";

export default function PasswordItem(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showFavicon, setShowFavicon] = useState(true);
  const [decryptedPassword, setDecryptedPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [editData, setEditData] = useState({
    url: props.url,
    username: props.username,
    password: "",
    note: props.note || ""
  });

  const randomTextGenerator = (length) => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_*";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [fakePassword] = useState(() => randomTextGenerator(8));

  const viewPassword = async (masterPass) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${getURL()}/passwords/${props._id}/view`,
        { masterPassword: masterPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDecryptedPassword(res.data.password);
      return res.data.password;
    } catch (err) {
      toast("Incorrect master password");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!masterPassword) return;
    const password = await viewPassword(masterPassword);
    if (password) {
      navigator.clipboard.writeText(password);
      toast("Password copied to clipboard");
      setShowCopyDialog(false);
      setMasterPassword("");
    }
  };

  const handleEditPassword = async () => {
    if (!masterPassword) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${getURL()}/passwords/${props._id}`,
        { ...editData, masterPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast("Password updated successfully");
      setShowEditDialog(false);
      setMasterPassword("");
      window.dispatchEvent(new Event("updatePasswords"));
    } catch (err) {
      toast("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.id]: e.target.value });
  };

  const handleViewPassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      setDecryptedPassword("");
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }
    } else {
      const password = await viewPassword(masterPassword);
      if (password) {
        setShowPassword(true);
        setMasterPassword("");
        // Auto-hide after 10 seconds
        const timeout = setTimeout(() => {
          setShowPassword(false);
          setDecryptedPassword("");
          setHideTimeout(null);
          toast("Password hidden for security");
        }, 3000);
        setHideTimeout(timeout);
      }
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${getURL()}/passwords/logs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAuditLogs(res.data);
      setShowLogsDialog(true);
    } catch (err) {
      toast("Failed to fetch audit logs");
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  const removePasswordFunc = async () => {
    const data = await removePassword(
      { email: localStorage.getItem("email") },
      props._id
    );

    if (data.status === 200) {
      window.dispatchEvent(new Event("updatePasswords"));
      toast("Password was successfully deleted.");
      // todo: send event to reload passwords
      // alert("deleted successfully");
    }
  };

  const checkFavicon = (e) => {
    if (e.target.naturalWidth === 16 && e.target.naturalHeight === 16)
      setShowFavicon(false);
  };

  return (
    <>
      <Card className="relative group">
        <CardHeader>
          <CardTitle className="truncate pb-0.5">{props.url}</CardTitle>
          <CardDescription className="truncate flex items-center gap-1">
            <CalendarClock className="!h-4" />
            {"Added " +
              moment(props.createdAt).locale("en").format("DD.MM.YYYY HH:mm")}
          </CardDescription>
          <CardAction>
            {showFavicon ? (
              <img
                className="rounded-sm group-hover:hidden"
                src={`https://www.google.com/s2/favicons?domain_url=${props.url}&sz=32`}
                alt="favicon"
                height={28}
                width={28}
                onLoad={checkFavicon}
              />
            ) : (
              <Globe className="group-hover:hidden h-[28px] w-[28px]" />
            )}
            <div className="hidden group-hover:flex gap-1">
              <Button
                variant="icon"
                className="!px-2.5 hover:bg-muted"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="icon"
                className="!px-2.5 hover:bg-muted"
                onClick={fetchAuditLogs}
              >
                <History className="h-4 w-4" />
              </Button>
              <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="icon"
                  className="!px-2.5 hidden group-hover:block hover:bg-muted relative bottom-1 left-1"
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you really want to delete this password?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <AlertDialogAction onClick={removePasswordFunc}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Label className="text-sm text-muted-foreground">Username</Label>
            <div className="border-input flex relative h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none">
              <span className="truncate">{props.username}</span>
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Password</Label>
            <div className="border-input flex relative h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none">
            <span
              className={
                (showPassword
                  ? "transition-[filter] duration-[100ms]"
                  : "blur-[4px] select-none") + " truncate select-none"
              }
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              onContextMenu={(e) => e.preventDefault()}
              onSelectStart={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {showPassword ? decryptedPassword : fakePassword}
            </span>
            <div className="flex absolute right-0 top-1/2 transform -translate-y-1/2">
              <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="!px-2.5 h-9 w-9">
                    <Clipboard />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter Master Password</DialogTitle>
                    <DialogDescription>
                      Enter your master password to copy this password
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <Label htmlFor="masterPass">Master Password</Label>
                    <Input
                      id="masterPass"
                      type="password"
                      value={masterPassword}
                      onChange={(e) => setMasterPassword(e.target.value)}
                      placeholder="Enter your account password"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleCopyPassword}
                      disabled={!masterPassword || isLoading}
                    >
                      Copy Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="!px-2.5"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter Master Password</DialogTitle>
                    <DialogDescription>
                      Enter your master password to view this password
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <Label htmlFor="masterPassView">Master Password</Label>
                    <Input
                      id="masterPassView"
                      type="password"
                      value={masterPassword}
                      onChange={(e) => setMasterPassword(e.target.value)}
                      placeholder="Enter your account password"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={handleViewPassword}
                        disabled={!masterPassword || isLoading}
                      >
                        {showPassword ? "Hide" : "View"} Password
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          </div>
          {props.note && (
            <>
              <p className="text-muted-foreground text-sm mt-4 flex items-center gap-1">
                <PenLine className="!h-4" />
                Note: {props.note}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Enter your master password to edit this password
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="editUrl">URL</Label>
              <Input
                id="url"
                value={editData.url}
                onChange={handleEditChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editUsername">Username</Label>
              <Input
                id="username"
                value={editData.username}
                onChange={handleEditChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPassword">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={editData.password}
                onChange={handleEditChange}
                placeholder="Leave empty to keep current password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editNote">Note</Label>
              <Input
                id="note"
                value={editData.note}
                onChange={handleEditChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editMasterPass">Master Password</Label>
              <Input
                id="masterPassword"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Enter your account password"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleEditPassword}
              disabled={!masterPassword || isLoading}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="!w-[80vw] !max-w-[80vw]" style={{width: '80vw !important', maxWidth: '80vw !important'}}>
          <DialogHeader>
            <DialogTitle>Audit Logs</DialogTitle>
            <DialogDescription>
              Recent activity for all your passwords
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {auditLogs.length > 0 ? (
              <div className="space-y-2">
                {auditLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {log.action === 'VIEW_PASSWORD' && <Eye className="h-4 w-4 text-blue-500" />}
                        {log.action === 'COPY_PASSWORD' && <Clipboard className="h-4 w-4 text-green-500" />}
                        {log.action === 'ADD_PASSWORD' && <Plus className="h-4 w-4 text-green-600" />}
                        {log.action === 'EDIT_PASSWORD' && <Edit className="h-4 w-4 text-orange-500" />}
                        {log.action === 'DELETE_PASSWORD' && <Trash className="h-4 w-4 text-red-500" />}
                        <span className="font-medium">{log.action.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {log.url || log.passwordId?.url || 'Unknown'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {moment(log.createdAt).format('DD.MM.YYYY HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No audit logs found</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
