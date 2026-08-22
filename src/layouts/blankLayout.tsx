import {Outlet} from "react-router-dom";
import Footer from "src/components/core/Footer/Footer.tsx";

export default function BlankLayout() {
  return (
    <div>
      <div>
	      <Outlet />
      </div>
	    <div>
		    <Footer/>
	    </div>
    </div>
  );
}