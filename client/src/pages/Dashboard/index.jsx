import { AppSidebar } from "@/components/app-sidebar";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import PasswordGrid from "./PasswordGrid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { addPassword, getPasswords } from "@/models/Users";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import Settings from "./Settings";
import ChangePassword from "./ChangePassword";
import { toast } from "sonner";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [breadcrumb, setBreadcrumb] = useState("");
  const [formData, setFormData] = useState({});
  const [isLoaded, setLoaded] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadBreacrumb();
    if (searchParams.size === 0) load();
  }, [searchParams]);

  const loadBreacrumb = () => {
    setBreadcrumb(searchParams.size === 0 ? "" : searchParams.get("tab"));
  };

  const [passwords, setPasswords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  window.addEventListener("updatePasswords", () => {
    load();
  });

  const load = async (page = 1) => {
    const data = await getPasswords(page);

    if (data.status === 200) {
      setPasswords(data.user.passwords);
      setPagination(data.user.pagination);
      setCurrentPage(page);
    }
    if (data.status) setLoaded(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const addPasswordFunc = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await addPassword(formData);

    if (data.status === 200) {
      setFormData({});
      setOpen(false);
      toast("Password was successfully added.");
      load(); // Reload passwords after adding
    }
    setIsLoading(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-between items-center gap-2 w-full pr-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      {breadcrumb ? breadcrumb : "All Passwords"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {!breadcrumb && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus />
                    Add Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Password</DialogTitle>
                    <DialogDescription>
                      Enter all required information.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addPasswordFunc}>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="url">URL Address</Label>
                        <Input
                          type="url"
                          id="url"
                          name="url"
                          required
                          placeholder="https://example.com"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          type="text"
                          id="username"
                          name="username"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="masterPassword">Master Password</Label>
                        <Input
                          type="password"
                          id="masterPassword"
                          name="masterPassword"
                          required
                          placeholder="Your account password"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="note">Note</Label>
                          <p className="text-sm text-muted-foreground">
                            Optional
                          </p>
                        </div>
                        <Input
                          type="text"
                          id="note"
                          name="note"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[110px]"
                      >
                        {isLoading ? (
                          <Spinner variant="ellipsis" />
                        ) : (
                          "Save Password"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>
        {!breadcrumb ? (
          <>
            <PasswordGrid isLoaded={isLoaded} passwords={passwords} />
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => load(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={() => load(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          (breadcrumb === "Settings" && <Settings />) ||
          (breadcrumb === "ChangePassword" && <ChangePassword />)
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
