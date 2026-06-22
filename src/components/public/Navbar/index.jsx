import logo from "@/../public/logo.jpeg";
import { Icon } from "@/constant";
import Image from "next/image";
import Link from "next/link";

function Navbar({ onAdmin }) {
  return (
    <nav className="public-nav">
      <div className="public-nav-inner">
        <div className="brand">
          <Image
            src={logo}
            alt="CampusVoice Logo"
            width={50}
            height={50}
            className="brand-logo"
            priority
          />

          <div>
            <b>THE CAG COLLEGE</b>
            <small>Campus Voice</small>
          </div>
        </div>

        {onAdmin && (
          <Link className="admin-link" href="/admin">
            Admin login <Icon name="arrow" size={15} />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
